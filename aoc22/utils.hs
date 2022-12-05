{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE RankNTypes #-}

module Utils
  ( module Data.Either,
    module Data.Text,
    module Data.Text.IO,
    module Data.Text.Read,
    textToInt,
    thrd,
    table,
    halfList,
    bimap,
    trimap,
    triplet,
    ints,
  )
where

import Data.Bifunctor (Bifunctor (bimap))
import Data.Char (isDigit)
import Data.Either
import Data.List qualified as L
import Data.Maybe (fromMaybe)
import Data.Text
import Data.Text.IO
import Data.Text.Read

textToInt :: Text -> Integer
textToInt = fst . fromRight undefined . decimal

thrd :: (a, b, c) -> c
thrd (_, _, c) = c

table :: forall a b. Eq a => [(a, b)] -> a -> b
table n x = fromMaybe undefined (lookup x n)

halfList :: [a] -> ([a], [a])
halfList myList = L.splitAt (L.length myList `div` 2) myList

trimap :: (a -> d) -> (b -> e) -> (c -> f) -> (a, b, c) -> (d, e, f)
trimap fa fb fc (a, b, c) = (fa a, fb b, fc c)

triplet :: [a] -> (a, a, a)
triplet [d, d2, d3] = (d, d2, d3)

_ints :: String -> String -> [Int] -> [Int]
_ints num remain nums
  | remain == "" && num /= "" = nums ++ [read num]
  | remain == "" && num == "" = nums
  | isDigit (L.head remain) = _ints (num ++ [L.head remain]) (L.tail remain) nums
  | num /= "" = _ints "" (L.tail remain) (nums ++ [read num])
  | otherwise = _ints num (L.tail remain) nums

ints :: String -> [Int]
ints a = _ints "" a []