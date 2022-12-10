import Data.List.Split (splitOn)

data Instruction = Noop | Addx Int deriving (Show)

main :: IO ()
main = do
  input <- parse . lines <$> readFile "10.txt"
  let res = cpu input [20, 60, 100, 140, 180, 220]
  print $ fst res
  putStrLn $ snd res
  where
    parse [] = []
    parse (x : xs) = case splitOn " " x of
      ["addx", n] -> Noop : Addx (read n :: Int) : parse xs
      _ -> Noop : parse xs

cpu :: [Instruction] -> [Int] -> (Int, String)
cpu inst measure = run inst measure 1 1 (0, "")
  where
    run [] _ _ _ s = s
    run (i : is) m c x (s, screen) = do
      let ns = if c `elem` m then s + (c * x) else s
      let rcycle = mod c 40
      let nscreen
            | rcycle == 0 = screen ++ "\n"
            | rcycle `elem` [x .. x + 2] = screen ++ "█"
            | otherwise = screen ++ " "
      let nx = case i of
            Addx n -> x + n
            Noop -> x
      run is m (c + 1) nx (ns, nscreen)