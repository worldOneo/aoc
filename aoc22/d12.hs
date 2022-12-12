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
  print $ hunt (tx, ty) (< 2) 'E' info
  print $ hunt (gx, gy) (> (-2)) 'a' info
  where
    find :: Int -> Char -> [String] -> (Int, Int)
    find _ _ [] = undefined
    find i c (s : ss) = do
      let x = fromMaybe (-1) (elemIndex c s)
      if x /= -1 then (x, i) else find (i + 1) c ss

constructMap :: String -> Input
constructMap s = (listArray (0, length (lines s)) . map (\x -> listArray (0, length x) x) . lines) s

hunt :: (Int, Int) -> (Int -> Bool) -> Char -> Input -> Int
hunt (tx, ty) isAllowed goal inp = run S.empty [(tx, ty, 0)]
  where
    reachable (x, y) = do
      let real o
            | o == 'S' = ord 'a'
            | o == 'E' = ord 'z'
            | otherwise = ord o
      let current = real ((inp ! y) ! x)
      let row = inp ! y
      let nu = [(x, y + 1) | y < (length inp - 2) && isAllowed (real ((inp ! (y + 1)) ! x) - current)]
      let nd = if y > 0 && isAllowed (real ((inp ! (y - 1)) ! x) - current) then (x, y - 1) : nu else nu
      let nr = if x < (length row - 2) && isAllowed (real (row ! (x + 1)) - current) then (x + 1, y) : nd else nd
      if x > 0 && isAllowed (real (row ! (x - 1)) - current) then (x - 1, y) : nr else nr

    run _ [] = 99999999999999
    run visited ((x, y, l) : steps)
      | S.member (x, y) visited = run visited steps
      | ((inp ! y) ! x) == goal = l
      | otherwise = run (S.insert (x, y) visited) (steps ++ map (\(nx, ny) -> (nx, ny, l + 1)) (reachable (x, y)))