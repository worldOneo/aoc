{-# LANGUAGE ImportQualifiedPost #-}

module Main (main) where

import Data.Char (ord)
import Data.List (sortBy)
import Data.Maybe (fromMaybe)
import Utils qualified as U

main :: IO ()
main = do
  input <-
    map (\a -> (U.index a 0, U.index a 2)) . filter (/= U.pack "") . U.splitOn (U.pack "\n") <$> U.readFile "02.txt"
  print $ d2p1 input
  print $ d2p2 input
  print $ d2 input

data Moves = Rock | Paper | Scissors
  deriving (Eq, Show, Enum)

to :: Char -> Moves
to = U.table [('A', Rock), ('B', Paper), ('C', Scissors), ('X', Rock), ('Y', Paper), ('Z', Scissors)]

should :: Moves -> Moves
should = U.table [(Rock, Paper), (Paper, Scissors), (Scissors, Rock)]

loose :: Moves -> Moves
loose = U.table [(Rock, Scissors), (Paper, Rock), (Scissors, Paper)]

translate :: Moves -> Moves -> Moves
translate other = U.table [(Rock, loose other), (Paper, other), (Scissors, should other)]

moveScore :: Moves -> Int
moveScore = U.table [(Rock, 1), (Paper, 2), (Scissors, 3)]

gameScore :: (Moves, Moves, Moves) -> Int
gameScore (other, should, me)
  | me == other = 3
  | should == me = 6
  | otherwise = 0

d2p1 :: [(Char, Char)] -> Int
d2p1 = sum . map ((\x -> gameScore x + moveScore (U.thrd x)) . (\(a, b) -> (to a, should (to a), to b)))

d2p2 :: [(Char, Char)] -> Int
d2p2 = sum . map ((\x -> gameScore x + moveScore (U.thrd x)) . (\(a, b) -> (to a, should (to a), translate (to a) (to b))))

-- Rewritten from someone else who must suffer from a big brain:

d2 :: [(Char, Char)] -> (Int, Int)
d2 a = do
  let rps (op, you) = (ord op - ord 'A', ord you - ord 'X')
  let s1 (op, you) = mod (you - op + 1) 3 * 3 + you + 1
  let s2 (op, you) = mod (you + op - 1) 3 + you * 3 + 1
  ( sum (map (s1 . rps) a),
    sum (map (s2 . rps) a)
    )
