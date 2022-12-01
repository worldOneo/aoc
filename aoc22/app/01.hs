{-# LANGUAGE ImportQualifiedPost #-}

import Data.Either
import Data.List
import Data.Text (Text, pack, unpack)
import Data.Text qualified as T
import Data.Text.IO qualified as T
import Data.Text.Read qualified as T

main :: IO ()
main = do
  input <-
    map (map textToInt . T.lines)
      . T.splitOn (pack "\n\n")
      <$> T.readFile "01.txt"
  print $ d1p1 input
  print $ d1p2 input

textToInt :: Text -> Integer
textToInt = fst . fromRight undefined . T.decimal

d1p1 :: [[Integer]] -> Integer
d1p1 = maximum . map sum

d1p2 :: [[Integer]] -> Integer
d1p2 = sum . take 3 . sortBy (flip compare) . map sum