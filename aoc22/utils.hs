module Utils
  ( module Data.Either,
    module Data.Text,
    module Data.Text.IO,
    module Data.Text.Read,
    textToInt,
    thrd,
    table,
  )
where

import Data.Either
import Data.List
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