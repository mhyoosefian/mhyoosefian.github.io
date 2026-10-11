---
layout: post
title: "Generators and the exponential map"
date: 2024-10-01
permalink: /blog/lie-groups/the-exponential-map/
series: lie-groups
series_title: "A Short Note on Lie Groups"
part: 3
summary: "Generators, the wedge and vee operators, the exponential map, and how rotations and poses are propagated in SO(3) and SE(3)."
math: true
---

In this part, we look more closely at matrix Lie groups: their generators, the exponential map, and how they are used to propagate rotations and poses in time.

## 7. A closer look at Lie groups

### Generators

For matrix groups, the *generators* are a basis of the Lie algebra: a set of linearly independent matrices, one for each direction, whose linear combinations give every element of the Lie algebra. We denote them by $$E_i$$, and their counterparts in the tangent space at $$g$$ by $${}^{g}E_i$$. Note that the generators are elements of the tangent space, not of the group. From (2) in the previous part,

$$
{}^{g}E_i = g E_i. \tag{3}
$$

So far, we have gone from a curved manifold to a linear tangent space. The elements of this tangent space are still matrices, though, and it is more convenient to work with vectors. We go from a vector to the Lie algebra with the *wedge* operator, and back with the *vee* operator:

$$
\begin{aligned}
\wedge &: \mathbb{R}^n \to \mathfrak{g}, & \rho &\mapsto \rho^\wedge = \sum_{i=1}^n \rho_i E_i, \\
\vee &: \mathfrak{g} \to \mathbb{R}^n, & \rho^\wedge &\mapsto (\rho^\wedge)^\vee = \rho = \sum_{i=1}^n \rho_i e_i,
\end{aligned} \tag{4}
$$

where $$n$$ is the dimension of the Lie algebra and $$e_i$$ is the $$i$$-th basis vector of $$\mathbb{R}^n$$, so that $$e_i^\wedge = E_i$$. In fact, $$E_i$$ is the velocity of the group at the identity in the $$i$$-th direction. Replacing $$E_i$$ by $${}^{g}E_i$$ generalizes (4) to any tangent space $$T_g \mathrm{G}$$.

### The exponential map

To derive the tangent spaces, we used paths $$\gamma : \mathbb{R} \to \mathrm{G}$$. The path itself lives in the group, but its derivative at $$t = 0$$ lives in the tangent space. For matrix groups, the best path was $$\exp(At)$$, and the Lie algebra was the set of matrices $$A$$ (with some constraints on their entries), because $$\dot\gamma(0) = A$$. So the exponential takes an element $$A$$ of the Lie algebra to an element $$\exp(A)$$ of the group:

$$
\exp : \mathfrak{g} \to \mathrm{G}.
$$

This is the *exponential map*, and its (local) inverse is the logarithm, $$\log : \mathrm{G} \to \mathfrak{g}$$. The exponential maps the Lie algebra, the tangent space at the identity, to the group. For a tangent space at another point $$g$$, we pre-multiply by $$g$$ and use $$g \exp(A)$$; this is exactly the form of the paths $$\gamma(t) = g \exp(At)$$ of the previous part.

Now, there are two natural ways to bring the velocity $$\dot\gamma$$ of a path back to the Lie algebra: multiplying it by $$\gamma^{-1}$$ on the right, or on the left. They come from differentiating the two sides of the inverse property, $$\gamma \gamma^{-1} = e$$ and $$\gamma^{-1} \gamma = e$$.

**Right multiplication.** Let $$\gamma(t) \in \mathrm{G}$$ with $$\gamma(0) = g$$, so that $$\dot\gamma(0) \in T_g \mathrm{G}$$. Using (2), $$\dot\gamma(0) = g \rho^\wedge$$ for some $$\rho^\wedge \in \mathfrak{g}$$, so

$$
\dot\gamma(0)\, \gamma(0)^{-1} = g \rho^\wedge g^{-1}.
$$

This expression is the *adjoint action* of the group on its Lie algebra, which, as we will see in the last part, gives another element of the Lie algebra. We denote it by

$$
\mu^\wedge = g \rho^\wedge g^{-1}. \tag{5}
$$

If $$\mu^\wedge = \dot\gamma(t)\, \gamma(t)^{-1}$$ is constant, the ODE $$\dot\gamma = \mu^\wedge \gamma$$ has the solution

$$
\gamma(t) = \exp(\mu^\wedge t)\, g. \tag{6}
$$

**Left multiplication.** In the same way, $$\gamma(0)^{-1} \dot\gamma(0) = g^{-1} g \rho^\wedge = \rho^\wedge \in \mathfrak{g}$$. If $$\rho^\wedge = \gamma(t)^{-1} \dot\gamma(t)$$ is constant, the ODE $$\dot\gamma = \gamma \rho^\wedge$$ has the solution

$$
\gamma(t) = g \exp(\rho^\wedge t). \tag{7}
$$

In (6) and (7), both $$g$$ and $$\gamma(t)$$ are in the group, and the group is closed under multiplication, so $$\exp(\mu^\wedge t)$$ and $$\exp(\rho^\wedge t)$$ are in the group too: the exponential indeed maps $$\rho^\wedge, \mu^\wedge \in \mathfrak{g}$$ into $$\mathrm{G}$$.

The exponential map has the following properties.

- **One-parameter subgroup:** $$\exp\big((t + s) \rho^\wedge\big) = \exp(t \rho^\wedge) \exp(s \rho^\wedge)$$.
- **Powers:** $$\exp(k \rho^\wedge) = \exp(\rho^\wedge)^k$$ for any integer $$k$$.
- **Inverse:** $$\exp(-\rho^\wedge) = \exp(\rho^\wedge)^{-1}$$.
- **Adjoint:** $$\exp(g \rho^\wedge g^{-1}) = g \exp(\rho^\wedge) g^{-1}$$.

The last property involves conjugation and the adjoint, which are the topic of the last part.

To sum up, we go between the Lie algebra and the group with $$\exp$$ and $$\log$$, and between the Lie algebra and vectors with $$\wedge$$ and $$\vee$$. Some authors (for example, Solà et al.) combine the two steps and go directly between $$\mathbb{R}^n$$ and the group with capitalized versions of the maps:

$$
\begin{aligned}
\mathrm{Exp} &: \mathbb{R}^n \to \mathrm{G}, & \rho &\mapsto \mathrm{Exp}(\rho) = \exp(\rho^\wedge), \\
\mathrm{Log} &: \mathrm{G} \to \mathbb{R}^n, & g &\mapsto \mathrm{Log}(g) = \log(g)^\vee.
\end{aligned}
$$

In this note, we stick to the standard maps.

### Illustrative examples

#### Rotations: $$\mathrm{SO}(3)$$

The Lie algebra $$\mathfrak{so}(3)$$ of the rotation group is the set of $$3 \times 3$$ skew-symmetric matrices. For a vector $$\omega \in \mathbb{R}^3$$, the corresponding skew-symmetric matrix is

$$
[\omega]_\times = \begin{bmatrix} 0 & -\omega_3 & \omega_2 \\ \omega_3 & 0 & -\omega_1 \\ -\omega_2 & \omega_1 & 0 \end{bmatrix},
$$

the matrix for which $$[\omega]_\times x = \omega \times x$$. So $$[\omega]_\times \in \mathfrak{so}(3)$$, and the wedge operator of $$\mathfrak{so}(3)$$ is simply $$\omega^\wedge = [\omega]_\times$$. From (4),

$$
\omega^\wedge = [\omega]_\times = \omega_1 E_1 + \omega_2 E_2 + \omega_3 E_3,
$$

with the generators

$$
E_1 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}, \quad
E_2 = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ -1 & 0 & 0 \end{bmatrix}, \quad
E_3 = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}.
$$

There are three generators because $$\dim(\mathfrak{so}(3)) = 3$$, and each is a $$3 \times 3$$ matrix because the elements of $$\mathfrak{so}(3)$$ are. The vector $$\omega$$ is in fact an angular velocity, since the Lie algebra is the space of velocities of the group, and the group is rotations.

Consider a robot whose orientation, after some rotation, is the rotation matrix $$R$$, and let $$\omega^b \in \mathbb{R}^3$$ be its angular velocity expressed in the body frame. We can map it to the Lie algebra, $$\omega^{b\wedge} \in \mathfrak{so}(3)$$. One might think that, because $$\omega^b$$ is expressed in the body frame, $$\omega^{b\wedge}$$ lies in the tangent space at $$R$$, $$T_R \mathrm{SO}(3)$$. This is not the case: by (4), the wedge operator maps a vector to the Lie algebra, not to other tangent spaces. We come back to this in the last part.

The angular velocity in the spatial (world) frame is $$\omega^s = R \omega^b$$, so

$$
\omega^{s\wedge} = (R \omega^b)^\wedge = R\, \omega^{b\wedge} R^\top. \tag{8}
$$

The last equality holds because, for any vector $$x$$,

$$
R\, [\omega^b]_\times R^\top x = R \big(\omega^b \times R^\top x\big) = (R \omega^b) \times (R R^\top x) = [R \omega^b]_\times x,
$$

where we used the fact that rotations preserve cross products, $$R(a \times b) = (Ra) \times (Rb)$$. Comparing (8) with (5), we see that $$\rho^\wedge = \omega^{b\wedge}$$ and $$\mu^\wedge = \omega^{s\wedge}$$, so the ODEs of the previous section become

$$
\dot R = \omega^{s\wedge} R, \qquad \dot R = R\, \omega^{b\wedge}. \tag{9}
$$

If $$\omega$$ is constant, for instance between two IMU samples at times $$t_k$$ and $$t_{k+1} = t_k + \Delta t$$, we can integrate (9):

$$
R(t_{k+1}) = \exp(\omega^{s\wedge} \Delta t)\, R(t_k), \qquad R(t_{k+1}) = R(t_k) \exp(\omega^{b\wedge} \Delta t). \tag{10}
$$

As a check, both equations in (9) give the same $$\dot R$$: using (8),

$$
\dot R = \omega^{s\wedge} R = R\, \omega^{b\wedge} R^\top R = R\, \omega^{b\wedge}.
$$

This is a general pattern: $$\rho^\wedge$$ in (5) is always the wedge of a quantity expressed in the body frame, and $$\mu^\wedge$$ the wedge of the same quantity expressed in the spatial frame. We use this in the next example, and explain why in the last part.

Now consider the second equation in (10) with $$R(t_k) = I$$: we want the small change in orientation during $$\Delta t$$. Define $$\theta = \omega^b \Delta t$$ and write $$\theta = \lVert \theta \rVert u$$, where the unit vector $$u$$ is the axis of rotation. Then

$$
R = \exp([\theta]_\times) = \sum_{k=0}^\infty \frac{\lVert \theta \rVert^k}{k!} [u]_\times^k.
$$

Since $$[u]_\times^3 = -[u]_\times$$ for a unit vector $$u$$, the powers of $$[u]_\times$$ repeat, and grouping the terms gives the closed form

$$
R = \exp([\theta]_\times) = I + \sin \lVert \theta \rVert\, [u]_\times + \big(1 - \cos \lVert \theta \rVert\big) [u]_\times^2,
$$

the well-known *Rodrigues rotation formula*. With it, we can compute the change in orientation over $$\Delta t$$ during which $$\omega$$ is constant.

#### Rigid-body motion: $$\mathrm{SE}(3)$$

Now consider a robot that rotates ($$R$$) and translates ($$p$$) at the same time. Its pose is an element of $$\mathrm{SE}(3)$$,

$$
\begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix},
$$

and the elements of the Lie algebra $$\mathfrak{se}(3)$$ are of the form

$$
\begin{bmatrix} [\omega]_\times & v \\ 0 & 0 \end{bmatrix},
$$

where $$\omega \in \mathbb{R}^3$$ is the angular velocity and $$v \in \mathbb{R}^3$$ the linear velocity. The vector is $$\begin{bmatrix} \omega \\ v \end{bmatrix} \in \mathbb{R}^6$$, and the generators are

$$
\begin{gathered}
E_1 = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \quad
E_2 = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 \\ -1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \quad
E_3 = \begin{bmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \\
E_4 = \begin{bmatrix} 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \quad
E_5 = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \quad
E_6 = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
\end{gathered}
$$

There are six generators because $$\dim(\mathfrak{se}(3)) = 6$$ ($$3$$ for the skew-symmetric matrix and $$3$$ for the linear velocity), and each is a $$4 \times 4$$ matrix. As for $$\mathfrak{so}(3)$$,

$$
\begin{bmatrix} [\omega]_\times & v \\ 0 & 0 \end{bmatrix} = \omega_1 E_1 + \omega_2 E_2 + \omega_3 E_3 + v_1 E_4 + v_2 E_5 + v_3 E_6.
$$

If the velocities are expressed in the body frame, the corresponding element of the Lie algebra is $$\rho^\wedge$$:

$$
\rho^\wedge = \begin{bmatrix} \omega^b \\ v^b \end{bmatrix}^\wedge = \begin{bmatrix} [\omega^b]_\times & v^b \\ 0 & 0 \end{bmatrix}. \tag{11}
$$

We claim that $$\mu^\wedge = \begin{bmatrix} \omega^s \\ v^s \end{bmatrix}^\wedge$$, the same velocities expressed in the spatial frame. From kinematics, we know that

$$
\omega^s = R \omega^b, \qquad v^s = R v^b + p \times \omega^s, \tag{12}
$$

which, mapped to the Lie algebra, gives

$$
\begin{bmatrix} \omega^s \\ v^s \end{bmatrix}^\wedge = \begin{bmatrix} [\omega^s]_\times & v^s \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} R [\omega^b]_\times R^\top & R v^b + [p]_\times R \omega^b \\ 0 & 0 \end{bmatrix}. \tag{13}
$$

On the other hand, (5) gives

$$
\begin{aligned}
\mu^\wedge = g \rho^\wedge g^{-1}
&= \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} [\omega^b]_\times & v^b \\ 0 & 0 \end{bmatrix} \begin{bmatrix} R^\top & -R^\top p \\ 0 & 1 \end{bmatrix} \\
&= \begin{bmatrix} R [\omega^b]_\times R^\top & -R [\omega^b]_\times R^\top p + R v^b \\ 0 & 0 \end{bmatrix} \\
&= \begin{bmatrix} R [\omega^b]_\times R^\top & R v^b + [p]_\times R \omega^b \\ 0 & 0 \end{bmatrix},
\end{aligned}
$$

where, in the last step, we used $$R [\omega^b]_\times R^\top = [R \omega^b]_\times$$ from (8) and $$-[R\omega^b]_\times p = p \times R \omega^b$$. This is the same as (13), so indeed $$\rho^\wedge$$ holds the body-frame velocities and $$\mu^\wedge$$ the spatial-frame velocities, as claimed.

As for $$\mathrm{SO}(3)$$, the two ODEs are

$$
\begin{aligned}
\dot\gamma = \mu^\wedge \gamma &\implies \begin{bmatrix} \dot R & \dot p \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} [\omega^s]_\times & v^s \\ 0 & 0 \end{bmatrix} \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}, \\
\dot\gamma = \gamma \rho^\wedge &\implies \begin{bmatrix} \dot R & \dot p \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} [\omega^b]_\times & v^b \\ 0 & 0 \end{bmatrix},
\end{aligned}
$$

and it is easy to check that both give the same $$\dot\gamma$$. If the angular and linear velocities are constant between two IMU samples, solving the ODEs gives

$$
\begin{aligned}
\begin{bmatrix} R(t_{k+1}) & p(t_{k+1}) \\ 0 & 1 \end{bmatrix} &= \exp\left( \begin{bmatrix} [\omega^s]_\times & v^s \\ 0 & 0 \end{bmatrix} \Delta t \right) \begin{bmatrix} R(t_k) & p(t_k) \\ 0 & 1 \end{bmatrix}, \\
\begin{bmatrix} R(t_{k+1}) & p(t_{k+1}) \\ 0 & 1 \end{bmatrix} &= \begin{bmatrix} R(t_k) & p(t_k) \\ 0 & 1 \end{bmatrix} \exp\left( \begin{bmatrix} [\omega^b]_\times & v^b \\ 0 & 0 \end{bmatrix} \Delta t \right).
\end{aligned}
$$

As before, take the second equation with $$R(t_k) = I$$ and $$p(t_k) = 0$$, and define $$\theta = \omega^b \Delta t$$, $$r = v^b \Delta t$$ and $$X = \begin{bmatrix} [\theta]_\times & r \\ 0 & 0 \end{bmatrix}$$. Then

$$
\begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} = \exp(X) = I + X + \frac{1 - \cos \lVert \theta \rVert}{\lVert \theta \rVert^2} X^2 + \frac{\lVert \theta \rVert - \sin \lVert \theta \rVert}{\lVert \theta \rVert^3} X^3,
$$

the Rodrigues formula for rotation and translation. It gives the small rotation and translation over $$\Delta t$$, during which $$\omega^b$$ and $$v^b$$ are constant.

#### Takeaway

$$\mathrm{SO}(3)$$ and $$\mathrm{SE}(3)$$ are the two most important Lie groups in robotics. For both, we found their Lie algebras and saw how to propagate a rotation or a pose in time from velocity measurements. The important point: if a velocity is measured in the **body frame**, its wedge is $$\rho^\wedge$$ and the state follows $$\dot\gamma = \gamma \rho^\wedge$$; if it is measured in the **spatial frame**, its wedge is $$\mu^\wedge$$ and the state follows $$\dot\gamma = \mu^\wedge \gamma$$. The last part explains the connection between the two.
