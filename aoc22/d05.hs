{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE Strict #-}

import Data.List qualified as L
import Data.List.Split (splitOn)
import Utils qualified as U

main :: IO ()
main = do
  input <- readFile "05.txt"
  print $ d5p1 input
  print $ d5p2 input

readContainers :: String -> [Char]
readContainers "" = []
readContainers d = (head . tail) d : if length d > 3 then readContainers (drop 4 d) else []

crane :: Bool -> String -> String
crane imACrateMover9001 input = do
  let [containers, inst] = splitOn "\n\n" input
  let stacks = (map (filter (/= ' ')) . L.transpose . map readContainers . init . splitOn "\n") containers
  (map (U.headOr ' ') . applyAll (lines inst)) stacks
  where
    applyAll [] stacks = stacks
    applyAll instructions stacks = applyAll (tail instructions) (apply (head instructions) stacks)
    apply instruction stacks = do
      let [move, from, to] = U.ints instruction
      let dropped = drop move (stacks !! (from - 1))
      let stacker = (if imACrateMover9001 then id else reverse)
      let stolen = stacker (take move (stacks !! (from - 1))) ++ (stacks !! (to - 1))
      U.repl (from - 1) dropped (U.repl (to - 1) stolen stacks)

d5p1 :: String -> String
d5p1 = crane False

d5p2 :: String -> String
d5p2 = crane True
