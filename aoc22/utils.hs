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
    triplet
  )
where

import Data.Bifunctor (Bifunctor (bimap))
import Data.Either
import Data.List as L
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

