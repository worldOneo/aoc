import Data.Set (fromList)

main :: IO ()
main = do
  input <- readFile "06.txt"
  print $ d6p1 input 0
  print $ d6p2 input 0

d6p1 :: String -> Int -> Int
d6p1 a b = if (length . fromList . take 4) a == 4 then b + 4 else d6p1 (tail a) (b + 1)

d6p2 :: String -> Int -> Int
d6p2 a b = if (length . fromList . take 14) a == 14 then b + 14 else d6p2 (tail a) (b + 1)