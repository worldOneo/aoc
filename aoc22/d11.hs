{-# LANGUAGE ImportQualifiedPost #-}

import Data.List (sortBy)
import Data.List.Split (splitOn)
import Data.Map qualified as M
import Data.Maybe (fromMaybe)
import Utils qualified as U

data WorryCalc = Square | Add Int | Mul Int deriving (Show)

data Monkey = Monkey
  { items :: [Int],
    worry :: WorryCalc,
    test :: Int,
    throwOk :: Int,
    throwElse :: Int,
    inspected :: Int
  }
  deriving (Show)

main :: IO ()
main = do
  groups <- splitOn "\n\n" <$> readFile "11.txt"
  let monkeys = (M.fromList . zip [(0 :: Int) ..] . map parseMonkey) groups
  let monkeybusiness = product . take 2 . sortBy (flip compare) . map inspected . M.elems
  print $ (monkeybusiness . simRounds 3 20) monkeys
  print $ (monkeybusiness . simRounds 1 10000) monkeys
  where
    parseMonkey group = do
      let dat = lines group
      let startingItems = U.ints (dat !! 1)
      let w = case splitOn " " (dat !! 2) of
            [_, _, _, _, _, "old", "*", "old"] -> Square
            [_, _, _, _, _, "old", "+", x] -> Add (read x)
            [_, _, _, _, _, "old", "*", x] -> Mul (read x)
            _ -> undefined
      let t = (read . last . splitOn " ") (dat !! 3)
      let ok = (read . last . splitOn " ") (dat !! 4)
      let els = (read . last . splitOn " ") (dat !! 5)
      Monkey {items = startingItems, worry = w, test = t, throwOk = ok, throwElse = els, inspected = 0}

simRound :: Int -> M.Map Int Monkey -> M.Map Int Monkey
simRound wd monkeys = do
  let bigMod = (product . map test . M.elems) monkeys
  simulate 0 monkeys bigMod
  where
    handoff [] m ms _ = (m {items = []}, ms)
    handoff (i : is) m ms bigMod = do
      let w = case worry m of
            Square -> i * i
            Add x -> i + x
            Mul x -> i * x
      let nw = mod (div w wd) bigMod
      let throwTo = (if mod nw (test m) == 0 then throwOk m else throwElse m)
      let nms = M.adjust (\o -> (o {items = items o ++ [nw]})) throwTo ms
      handoff is (m {inspected = inspected m + 1}) nms bigMod

    simulate n m bigMod
      | n == length m = m
      | otherwise = do
          let monkey = fromMaybe undefined (M.lookup n m)
          let (nmon, nm) = handoff (items monkey) monkey m bigMod
          simulate (n + 1) (M.adjust (const nmon) n nm) bigMod

simRounds :: Int -> Int -> M.Map Int Monkey -> M.Map Int Monkey
simRounds _ 0 m = m
simRounds wd x m = simRounds wd (x - 1) (simRound wd m)