{-# LANGUAGE ImportQualifiedPost #-}


module Main (main) where

import Data.List
import Data.List.Split (splitOn)
import Utils qualified as U

main :: IO ()
main = do
  input <- readFile "04.txt"
  print $ d4p1 input
  print $ d4p2 input
  print $ d4p1' input
  print $ d4p2' input

parse :: String -> [[[Int]]]
parse = map (map split . splitOn ",") . filter (/= "") . lines
  where
    pair [a, b] = [read a .. read b]
    split = pair . splitOn "-"

d4p1 :: String -> Int
d4p1 = length . filter f . parse
  where
    f [a, b] = a `intersect` b `elem` [a, b]

d4p1' :: String -> Int
d4p1' = length . filter (\[a, b, c, d] -> [a .. b] `intersect` [c .. d] `elem` [[a .. b], [c .. d]]) . map U.ints . lines

d4p2 :: String -> Int
d4p2 = length . filter (/= []) . map (foldl1 intersect) . parse

d4p2' :: String -> Int
d4p2' = length . filter (\[a, b, c, d] -> d >= a && c <= b) . map U.ints . lines
