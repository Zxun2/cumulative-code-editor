def possiblesums(xs):
  length = len(xs)
  if (length <= 1):
    return xs
  else:
    li = list(map(lambda x: x + xs[0], possiblesums(xs[1:])))
    li.append(xs[0])
    return li


print(possiblesums([1, 2, 3]))