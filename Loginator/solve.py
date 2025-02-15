op = [
    0x02,
    0x92,
    0xA8,
    0x06,
    0x77,
    0xA8,
    0x32,
    0x3F,
    0x15,
    0x68,
    0xC9,
    0x77,
    0xDE,
    0x86,
    0x99,
    0x7D,
    0x08,
    0x60,
    0x8E,
    0x64,
    0x77,
    0xBE,
    0xBA,
    0x74,
    0x26,
    0x96,
    0xE7,
    0x4E,
]
xor_vals_state0 = [0x57, 0x21, 0x43, 0x99]
rotate_amounts = [1, 3, 5, 7]
xor_vals_state3 = [0xAA, 0xBB, 0xCC, 0xDD]
ip = ""
xor_index0, xor_index3, rotate_index, index = 0, 0, 0, 0


def sub_xor_state(c, xor_vals_state0, xor_index0):
    return chr((c ^ xor_vals_state0[xor_index0]) - 0x13), (xor_index0 + 1) % len(
        xor_vals_state0
    )


def reverse_rotation(c, rotate_amount, rotate_index):
    shift = rotate_amount[rotate_index]
    rotated = ((c >> shift) | (c << (8 - shift))) & 0xFF
    return chr(rotated), (rotate_index + 1) % len(rotate_amount)


def xor_not(c, xor_vals_state3, xor_index3):
    fixed = (~(c ^ xor_vals_state3[xor_index3])) & 0xFF
    return chr(fixed), (xor_index3 + 1) % len(xor_vals_state3)


def reverse_shift(c):
    return chr(c // 2)


for i in op:
    if index == 0:
        char, xor_index0 = sub_xor_state(i, xor_vals_state0, xor_index0)
    elif index == 1:
        char = reverse_shift(i)
    elif index == 2:
        char, rotate_index = reverse_rotation(i, rotate_amounts, rotate_index)
    else:
        char, xor_index3 = xor_not(i, xor_vals_state3, xor_index3)

    ip += char
    index = (index + 1) % 4

print(ip)
