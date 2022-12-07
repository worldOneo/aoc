{-# LANGUAGE ImportQualifiedPost #-}

import Data.Char
import Data.List (intercalate, sortBy)
import Data.List.Split
import Data.Map as M (Map, adjust, elems, insert, lookup, singleton)
import Data.Maybe
import Utils qualified as U

main :: IO ()
main = do
  input <- readFile "07.txt"
  let fs = parse ((tail . lines) input) [""] (M.singleton "" [])
  print $ (sum . filter (<= 100000) . sortBy (flip compare) . map sum . M.elems) fs
  let empty = 70000000 - (sum . fromMaybe undefined . M.lookup "") fs
  print $ (minimum . filter (>= (30000000 - empty)) . map sum . M.elems) fs

fill :: [String] -> Int -> Map String [Int] -> Map String [Int]
fill [] _ m = m
fill xs s m = fill (init xs) s (M.adjust (s :) (intercalate "/" xs) m)

parse :: [String] -> [String] -> Map String [Int] -> Map String [Int]
parse [] _ dirs = dirs
parse (cmd : ins) cur dirs = do
  let d = splitOn " " cmd
  if head d == "$"
    then
      if d !! 1 == "cd"
        then
          if d !! 2 == ".."
            then parse ins (init cur) dirs
            else parse ins (cur ++ [d !! 2]) dirs
        else parse ins cur dirs
    else
      if isDigit (head (head d))
        then parse ins cur (fill cur (head (U.ints (head d))) dirs)
        else parse ins cur (M.insert (intercalate "/" (cur ++ [d !! 1])) [] dirs)