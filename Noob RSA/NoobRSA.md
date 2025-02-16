# NOOB RSA Returns
### Author : K27
### POINTS : 498

## Description: 
break it this time

> Files given : encrypt.py and chall.txt


## SOLUTION

**1. Exponent Relationship**  
The value \( K \) is constructed as:  
\[
K = (A p^2 - C p + D) \cdot d
\]  
Raising a base \( a \) to \( eK \) modulo \( n \) gives:  
\[
a^{eK} \equiv a^{(A p^2 - C p + D)} \mod n
\]  
This holds because \( e \cdot d \equiv 1 \mod \phi(n) \) (RSA key relationship), implying \( eK \equiv A p^2 - C p + D \mod \phi(n) \).

**2. Modulo \( p \) Simplification**  
By Fermat's Little Theorem:  
\[
a^{p-1} \equiv 1 \mod p
\]  
The exponent simplifies modulo \( p-1 \):  
\[
A p^2 - C p + D \equiv A(0)^2 - C(0) + D \mod (p-1) \quad \Rightarrow \quad A - C + D \mod (p-1)
\]  
Thus:  
\[
a^{A p^2 - C p + D} \equiv a^{A - C + D} \mod p
\]

**3. GCD Calculation**  
Compute two critical values:  
\[
M = a^{eK} \mod n
\]  
\[
\mathrm{candidate} = a^{A - C + D} \mod n
\]  
Then:  
\[
p = \gcd(M - \mathrm{candidate}, n)
\]  
This works because \( M \equiv \mathrm{candidate} \mod p \) but \( M \not\equiv \mathrm{candidate} \mod q \), isolating \( p \) as a factor.
