import Data.Set (fromList)

main :: IO ()
main = do
  input <- readFile "06.txt"
  print $ solve input 0 4
  print $ solve input 0 14
  where
    solve a b c = if (length . fromList . take c) a == c then b + c else solve (tail a) (b + 1) c

d6p1 :: String -> Int -> Int
d6p1 a b = if (length . fromList . take 4) a == 4 then b + 4 else d6p1 (tail a) (b + 1)

d6p2 :: String -> Int -> Int
d6p2 a b = if (length . fromList . take 14) a == 14 then b + 14 else d6p2 (tail a) (b + 1)