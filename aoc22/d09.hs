{-# LANGUAGE ImportQualifiedPost #-}

import Data.Set qualified as S
import Utils qualified as U

main :: IO ()
main = do
  input <- lines <$> readFile "09.txt"
  let instructions = expand input []
  print $ length (fling instructions [(0, 0)] (0, 0) S.empty)
  print $ length (fling instructions (replicate 9 (0, 0)) (0, 0) S.empty)
  where
    expand [] res = res
    expand (inputs : is) res = do
      expand is (res ++ replicate (head (U.ints inputs)) (head inputs))

fling :: String -> [(Int, Int)] -> (Int, Int) -> S.Set (Int, Int) -> S.Set (Int, Int)
fling [] _ _ visited = visited
fling (instruction : instructions) ts (hx, hy) visited = do
  let h = case instruction of
        'R' -> (hx + 1, hy)
        'L' -> (hx - 1, hy)
        'D' -> (hx, hy - 1)
        'U' -> (hx, hy + 1)
        _ -> undefined

  let nts = snake (h : ts)

  fling instructions nts h (S.insert (last nts) visited)

snake :: [(Int, Int)] -> [(Int, Int)]
snake [] = []
snake [_] = []
snake ((hx, hy) : (tx, ty) : ts) = do
  let nt
        | (hx > tx + 1 && hy > ty) || (hx > tx && hy > ty + 1) = (tx + 1, ty + 1)
        | (hx < tx - 1 && hy > ty) || (hx < tx && hy > ty + 1) = (tx - 1, ty + 1)
        | (hx > tx + 1 && hy < ty) || (hx > tx && hy < ty - 1) = (tx + 1, ty - 1)
        | (hx < tx - 1 && hy < ty) || (hx < tx && hy < ty - 1) = (tx - 1, ty - 1)
        | hx == tx && hy > ty + 1 = (tx, ty + 1)
        | hx == tx && hy < ty - 1 = (tx, ty - 1)
        | hy == ty && hx > tx + 1 = (tx + 1, ty)
        | hy == ty && hx < tx - 1 = (tx - 1, ty)
        | otherwise = (tx, ty)
  nt : snake (nt : ts)