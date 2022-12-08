import Data.Char (digitToInt)
import Data.List (findIndex, transpose)
import Data.Maybe

main :: IO ()
main = do
  rows <- map (map digitToInt) . lines <$> readFile "08.txt"
  let cols = transpose rows
  let scores = visibles isvisibleScore rows cols
  print $ (sum . map (\x -> (if x /= (1 :: Int) then 1 else 0) :: Int) . concat) scores
  let scenicScores = visibles viewDist rows cols
  print $ (maximum . concat) scenicScores
  where
    visibles mapFunc rows cols = zipWith (\y row -> zipWith (\x _ -> visible mapFunc x y rows cols) [0 ..] row) [0 ..] rows
    visible mapFunc x y rows cols =
      let h = (rows !! y) !! x
       in mapFunc y h (cols !! x) * mapFunc x h (rows !! y)

    isvisibleScore x h r = if all (< h) (take x r) || all (< h) (drop (x + 1) r) then 2 else 1

    viewDist x h row = do
      let l = fromMaybe (-1) (findIndex (>= h) (reverse (take x row)))
      let r = fromMaybe (-1) (findIndex (>= h) (drop (x + 1) row))
      let sl = if l /= -1 then l + 1 else x
      let sr = if r /= -1 then r + 1 else length row - x - 1
      sr * sl