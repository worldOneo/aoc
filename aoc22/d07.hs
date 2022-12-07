{-# LANGUAGE ImportQualifiedPost #-}

import Data.List (intercalate, sortBy)
import Data.List.Split
import Data.Map as M (Map, adjust, elems, insert, lookup, singleton)
import Data.Maybe

main :: IO ()
main = do
  input <- readFile "07.txt"
  let fs = parse ((tail . lines) input) [""] (M.singleton "" [])
  print $ (sum . filter (<= 100000) . sortBy (flip compare) . map sum . M.elems) fs
  let empty = 70000000 - (sum . fromMaybe undefined . M.lookup "") fs
  print $ (minimum . filter (>= (30000000 - empty)) . map sum . M.elems) fs

addToParents :: [String] -> Int -> Map String [Int] -> Map String [Int]
addToParents [] _ m = m
addToParents xs s m = addToParents (init xs) s (M.adjust (s :) (intercalate "/" xs) m)

parse :: [String] -> [String] -> Map String [Int] -> Map String [Int]
parse [] _ dirs = dirs
parse (cmd : ins) cur dirs = do
  let d = splitOn " " cmd
  case d of
    ["$", "cd", ".."] -> parse ins (init cur) dirs
    ["$", "cd", n] -> parse ins (cur ++ [n]) dirs
    ("$" : _) -> parse ins cur dirs
    ["dir", f] -> parse ins cur (M.insert (intercalate "/" (cur ++ [f])) [] dirs)
    (s : _) -> parse ins cur (addToParents cur (head (read s)) dirs)
    _ -> undefined