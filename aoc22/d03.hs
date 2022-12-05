{-# LANGUAGE ImportQualifiedPost #-}

module Main (main) where

import Data.Char
import Data.List
import Data.List.Split qualified as Split
import Data.Set (fromList, member)
import Utils qualified as U

main :: IO ()
main = do
  input <- filter (/= U.pack "") . U.lines <$> U.readFile "03.txt"
  print $ d3p1 input
  print $ d3p2 input
  r <- d3p1'
  print r
  r2 <- d3p2'
  print r2

score :: Char -> Int
score c
  | isAsciiLower c = ord c - ord 'a' + 1
  | isAsciiUpper c = ord c - ord 'A' + 27

d3p1 :: [U.Text] -> Int
d3p1 =
  sum
    . map
      ( maximum
          . (\(s, c) -> map (\c -> if member c s then score c else 0) c)
          . U.bimap fromList id
          . (U.halfList . U.unpack)
      )

d3p2 :: [U.Text] -> Int
d3p2 =
  sum
    . map
      ( maximum
          . (\(a, b, c) -> map (\c -> if member c a && member c b then score c else 0) c)
          . U.trimap (fromList . U.unpack) (fromList . U.unpack) U.unpack
          . U.triplet
      )
    . Split.chunksOf 3

d3p1' :: IO Int
d3p1' =
  sum
    . map (score . head . uncurry intersect . U.halfList)
    . lines
    <$> readFile "03.txt"

d3p2' :: IO Int
d3p2' =
  sum
    . map (score . head . foldl1 intersect)
    . Split.chunksOf 3 . lines
    <$> readFile "03.txt"