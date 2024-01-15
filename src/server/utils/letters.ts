const alphabet = ['A', 'Å', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const letterPageMap: Record<string, number> = {
    'A': 0,
    'Å': 0,
    'B': 0,
    'C': 1,
    'D': 2,
    'E': 2,
    'F': 2,
    'G': 2,
    'H': 3,
    'I': 3,
    'J': 3,
    'K': 4,
    'L': 4,
    'M': 4,
    'N': 5,
    'O': 5,
    'P': 6,
    'Q': 6,
    'R': 6,
    'S': 6,
    'T': 7,
    'U': 8,
    'V': 8,
    'W': 8,
    'Y': 8,
    'Z': 9,
}

export { alphabet, letterPageMap }