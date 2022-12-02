{-# LANGUAGE ImportQualifiedPost #-}

module Main (main) where

import Data.List (sortBy)
import Utils qualified as U

main :: IO ()
main = do
  input <-
    map (map U.textToInt . U.lines)
      . U.splitOn (U.pack "\n\n")
      <$> U.readFile "01.txt"
  print $ d1p1 input
  print $ d1p2 input

d1p1 :: [[Integer]] -> Integer
d1p1 = maximum . map sum

d1p2 :: [[Integer]] -> Integer
d1p2 = sum . take 3 . sortBy (flip compare) . map sum