# Loginator

This challenge involves reverse engineering a stripped C binary and simply analyzing what the functions do and how they are used in the main function. The main function has a 4-state finite state machine which obfuscates the entered string character by character. The code for it is as follows:

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#define XOR_ARRAY_SIZE 4
#define ROTATE_ARRAY_SIZE 4

uint8_t add_xor_state(uint8_t c, uint8_t *xor_vals, int *xor_index, int xor_size) {
    uint8_t xor_val = xor_vals[*xor_index];
    *xor_index = (*xor_index + 1) % xor_size;
    return (c + 0x13) ^ xor_val;
}

uint8_t left_shift_state(uint8_t c) {
    return c << 1;
}

uint8_t rotate_state(uint8_t c, uint8_t *rotate_amounts, int *rotate_index, int rotate_size) {
    uint8_t amt = rotate_amounts[*rotate_index];
    *rotate_index = (*rotate_index + 1) % rotate_size;
    return (c << amt) | (c >> (8 - amt));
}

uint8_t not_xor_state(uint8_t c, uint8_t *xor_vals, int *xor_index, int xor_size) {
    uint8_t xor_val = xor_vals[*xor_index];
    *xor_index = (*xor_index + 1) % xor_size;
    return (~c) ^ xor_val;
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <string_to_obfuscate>\n", argv[0]);
        return 1;
    }
    
    const char *input = argv[1];
    size_t len = strlen(input);
    
    char *output = malloc(len + 1);
    if (!output) {
        perror("malloc");
        return 1;
    }
    
    uint8_t *xor_vals_state0 = malloc(XOR_ARRAY_SIZE * sizeof(uint8_t));
    if (!xor_vals_state0) {
        perror("malloc");
        free(output);
        return 1;
    }
    xor_vals_state0[0] = 0x57;
    xor_vals_state0[1] = 0x21;
    xor_vals_state0[2] = 0x43;
    xor_vals_state0[3] = 0x99;
    
    uint8_t *xor_vals_state3 = malloc(XOR_ARRAY_SIZE * sizeof(uint8_t));
    if (!xor_vals_state3) {
        perror("malloc");
        free(output);
        free(xor_vals_state0);
        return 1;
    }
    xor_vals_state3[0] = 0xAA;
    xor_vals_state3[1] = 0xBB;
    xor_vals_state3[2] = 0xCC;
    xor_vals_state3[3] = 0xDD;
    
    uint8_t *rotate_amounts = malloc(ROTATE_ARRAY_SIZE * sizeof(uint8_t));
    if (!rotate_amounts) {
        perror("malloc");
        free(output);
        free(xor_vals_state0);
        free(xor_vals_state3);
        return 1;
    }
    rotate_amounts[0] = 1;
    rotate_amounts[1] = 3;
    rotate_amounts[2] = 5;
    rotate_amounts[3] = 7;
    
    int xor_index0 = 0;
    int xor_index3 = 0;
    int rotate_index = 0;
    
    int state = 0;
    for (size_t i = 0; i < len; i++) {
        uint8_t c = (uint8_t)input[i];
        uint8_t obf;
        switch (state) {
            case 0:
                obf = add_xor_state(c, xor_vals_state0, &xor_index0, XOR_ARRAY_SIZE);
                break;
            case 1:
                obf = left_shift_state(c);
            case 2:
                obf = rotate_state(c, rotate_amounts, &rotate_index, ROTATE_ARRAY_SIZE);
                break;
            case 3:
                obf = not_xor_state(c, xor_vals_state3, &xor_index3, XOR_ARRAY_SIZE);
                break;
            default:
                obf = c;
                break;
        }
        output[i] = obf;
        state = (state + 1) % 4;
    }
    output[len] = '\0';
    
    printf("");
    for (size_t i = 0; i < len; i++) {
        printf("%02x ", (unsigned char)output[i]);
    }
    printf("\n");
    
    free(output);
    free(xor_vals_state0);
    free(xor_vals_state3);
    free(rotate_amounts);
    
    return 0;
}
```
In the challenge we are given an output, which is ``
02 92 a8 06 77 a8 32 3f 15 68 c9 77 de 86 99 7d 08 60 8e 64 77 be ba 74 26 96 e7 4e
`` and are expected to reverse engineer the string that would produce it.

This can be done using the following python script
```
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
```

Flag: ````BITSCTF{C4ND4C3_L0G1C_W0RK?}````
