{-# OPTIONS_GHC -O2 #-}

import Data.Array
import Data.Char (ord)
import Data.List (elemIndex)
import Data.Maybe (fromMaybe)
import qualified Data.Set as S

type Input = Array Int (Array Int Char)

main :: IO ()
main = do
  input <- readFile "12.txt"
  let info = constructMap input
  let (tx, ty) = find 0 'S' (lines input)
  let (gx, gy) = find 0 'E' (lines input)
  print $ hunt (tx, ty) (gx, gy) info
  print $ (minimum . map (\start -> hunt start (gx, gy) info)) (findAll (0, -1) "" (lines input) [])
  where
    find :: Int -> Char -> [String] -> (Int, Int)
    find _ _ [] = undefined
    find i c (s : ss) = do
      let x = fromMaybe (-1) (elemIndex c s)
      if x /= -1 then (x, i) else find (i + 1) c ss

    findAll :: (Int, Int) -> String -> [String] -> [(Int, Int)] -> [(Int, Int)]
    findAll _ _ [] r = r
    findAll (_, y) [] (s : ss) r = findAll (0, y + 1) s ss r
    findAll (x, y) (c : s) ss r = findAll (x + 1, y) s ss (if c == 'a' then (x, y) : r else r)

constructMap :: String -> Input
constructMap s = (listArray (0, length (lines s)) . map (\x -> listArray (0, length x) x) . lines) s

hunt :: (Int, Int) -> (Int, Int) -> Input -> Int
hunt (tx, ty) (gx, gy) inp = run S.empty [(tx, ty, 0)]
  where
    reachable (x, y) = do
      let real o
            | o == 'S' = ord 'a'
            | o == 'E' = ord 'z'
            | otherwise = ord o
      let current = real ((inp ! y) ! x)
      let row = inp ! y
      let nu = [(x, y + 1) | y < (length inp - 2) && (real ((inp ! (y + 1)) ! x) - current) < 2]
      let nd = if y > 0 && abs (real ((inp ! (y - 1)) ! x) - current) < 2 then (x, y - 1) : nu else nu
      let nr = if x < (length row - 2) && (real (row ! (x + 1)) - current) < 2 then (x + 1, y) : nd else nd
      let nl = if x > 0 && (real (row ! (x - 1)) - current) < 2 then (x - 1, y) : nr else nr
      nl

    run _ [] = 99999999999999
    run visited ((x, y, l) : steps)
      | S.member (x, y) visited = run visited steps
      | x == gx && y == gy = l
      | otherwise = run (S.insert (x, y) visited) (steps ++ map (\(nx, ny) -> (nx, ny, l + 1)) (reachable (x, y)))