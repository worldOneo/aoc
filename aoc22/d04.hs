{-# LANGUAGE ImportQualifiedPost #-}

module Main (main) where

import Data.List
import Data.List.Split (splitOn)
import Debug.Trace (trace, traceEvent)
import Utils qualified as U

main :: IO ()
main = do
  lines <- readFile "04.txt"
  print $ d3p1 lines
  print $ d3p2 lines

parse :: String -> [[[Int]]]
parse = map (map split . splitOn ",") . filter (/= "") . lines
  where
    pair [a, b] = [read a .. read b]
    split = pair . splitOn "-"

d3p1 :: String -> Int
d3p1 = length . filter f . parse
  where
    f [a, b] = a `intersect` b `elem` [a, b]

d3p2 :: String -> Int
d3p2 = do
  length . filter (/= []) . map (foldl1 intersect) . parse