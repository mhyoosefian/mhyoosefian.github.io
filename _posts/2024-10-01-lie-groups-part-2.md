---
layout: post
title: "Lie groups, tangent spaces and Lie algebras"
date: 2024-10-01
permalink: /blog/lie-groups/tangent-spaces-and-lie-algebras/
series: lie-groups
series_title: "A Short Note on Lie Groups"
part: 2
summary: "Smooth manifolds, tangent spaces, and the Lie algebras of the matrix groups used in robotics."
math: true
---

## 4. Matrix Lie groups

A *Lie group* is a group whose elements form a smooth manifold. A *smooth manifold* is, for our purposes, a subset of a Euclidean space that is smooth (differentiable), with no sharp edges or corners: loosely speaking, a smooth curved surface sitting in a Euclidean space. Two examples in $$\mathbb{R}^3$$ are shown below.

<figure style="max-width: 600px;"><img src="{{ '/files/blog/lie-groups/smooth-manifolds.png' | relative_url }}" alt="A hyperbolic paraboloid and a torus" loading="lazy"><figcaption>Two smooth manifolds in \(\mathbb{R}^3\): a hyperbolic paraboloid (left) and a torus (right).</figcaption></figure>

So a Lie group bridges algebra and geometry: it is a group whose set is also a manifold.

As we will see, the state of a robot evolves on a manifold. Doing calculus on a manifold is hard because it is curved, so instead we attach flat spaces (vector spaces) that are tangent to the manifold, and do calculus in them. Each of these tangent spaces comes with its own coordinates.

As an example, consider the points of $$\mathbb{R}^2$$ at unit distance from the origin. Identifying $$\mathbb{R}^2$$ with the complex plane, these points are $$z = \exp(i\theta)$$, as shown below. With complex multiplication (which adds the angles) as the operator, this set is a group: the identity is $$1$$, the inverse of $$z$$ is its conjugate $$z^* = \exp(-i\theta)$$, and closure and associativity are clear. The unit circle is also a smooth manifold, a curve in $$\mathbb{R}^2$$ with no corners, so this is a Lie group.

<figure style="max-width: 300px;"><img src="{{ '/files/blog/lie-groups/unit-circle.png' | relative_url }}" alt="The unit circle in the complex plane, with a point at angle theta" loading="lazy"><figcaption>The points at unit distance from the origin form a Lie group, with multiplication (addition of angles) as the operator.</figcaption></figure>

Why are the matrix groups of the previous part also Lie groups? What they have in common is that the group operations, multiplication and inversion, are infinitely differentiable (smooth) functions of the entries of the matrices. Together with the fact that each of these groups is a smooth subset of the space of matrices, this makes every one of them a Lie group, hence the name *matrix Lie group*.

## 5. Tangent space

Consider the manifold $$M$$ of a Lie group and a point $$x$$ on it, as shown below. Let $$\gamma(t) : \mathbb{R} \to M$$ be a path on the manifold that passes through $$x$$ at $$t = 0$$. There are infinitely many such paths. Their velocities at $$x$$, the derivatives $$\dot\gamma(0)$$, span a vector space $$T_x M$$, called the *tangent space* to $$M$$ at $$x$$.

<figure style="max-width: 460px;"><img src="{{ '/files/blog/lie-groups/tangent-space.png' | relative_url }}" alt="A curved surface M with a tangent plane at the point x" loading="lazy"><figcaption>The velocity \(v = \dot\gamma(0)\) of a path \(\gamma(t)\) through \(x\) on the manifold \(M\) belongs to the tangent space \(T_xM\).</figcaption></figure>

The manifold and its tangent spaces have the same dimension,

$$
\dim(T_x M) = \dim(M).
$$

In other words, specifying a point on the manifold takes as many numbers (degrees of freedom) as specifying a point in the tangent space. This dimension can be smaller than that of the ambient space they both live in. In the figure above, the ambient space is $$\mathbb{R}^3$$, while $$M$$ and $$T_x M$$ have dimension $$2$$. Importantly, the tangent space is a linear (vector) space, so doing calculus in it is much easier than on the manifold.

So, to find $$T_x M$$, we take all the paths on the manifold through $$x$$ and collect their velocities at $$x$$. For the unit circle below, two paths through $$x$$ are shown, one in green and one in magenta. Their velocities at $$x$$ point in opposite directions, but both lie on the same line, the line tangent to the circle at $$x$$, and every other path through $$x$$ gives a velocity on that line too. This line is $$T_x M$$. Both $$M$$ and $$T_x M$$ have dimension $$1$$: a point on the circle is specified by its angle, and a point on the tangent line by its signed distance from $$x$$.

<figure style="max-width: 300px;"><img src="{{ '/files/blog/lie-groups/tangent-to-circle.png' | relative_url }}" alt="The unit circle with two arcs through the point x and their tangent line" loading="lazy"><figcaption>The unit circle and its tangent space at \(x\). The two paths through \(x\) (green and magenta) have velocities on the same tangent line. The manifold and the tangent space both have dimension \(1\), whatever the dimension of the ambient space.</figcaption></figure>

The same ideas apply to matrix Lie groups (from now on, simply *matrix groups*). A matrix group is a subset of a Euclidean space, because a matrix can be vectorized:

$$
\mathrm{GL}_n(\mathbb{R}) \subset \mathrm{M}_n(\mathbb{R}) \cong \mathbb{R}^{n^2},
$$

where $$\cong$$ means that the two spaces can be identified (they are isomorphic as vector spaces). The entries of a matrix group are usually constrained, so the group is only a curved subset of this space rather than the whole of it, which is why it forms a manifold and not a flat space.

<div class="post-def" markdown="block">
**Definition (tangent space).** Let $$\mathrm{G} \subset \mathbb{R}^m$$ be a smooth manifold (in our case, the set of a Lie group) and let $$g \in \mathrm{G}$$. The tangent space to $$\mathrm{G}$$ at $$g$$ is

$$
T_g \mathrm{G} = \{ \dot\gamma(0) \mid \gamma : (-\epsilon, \epsilon) \to \mathrm{G} \text{ is differentiable and } \gamma(0) = g \} \tag{1}
$$

for some small $$\epsilon > 0$$.
</div>

So, to find $$T_g \mathrm{G}$$, we look for paths $$\gamma(t)$$ that (i) stay on the manifold, $$\gamma(t) \in \mathrm{G}$$, (ii) pass through $$g$$ at $$t = 0$$, $$\gamma(0) = g$$, and (iii) are differentiable for $$t \in (-\epsilon, \epsilon)$$. Their derivatives at $$t = 0$$ make up $$T_g \mathrm{G}$$.

## 6. Lie algebra definition and examples

<div class="post-def" markdown="block">
**Definition (Lie algebra).** The Lie algebra of a Lie group $$\mathrm{G}$$ is the tangent space (1) to $$\mathrm{G}$$ at the identity element $$e$$. It is denoted by $$\mathfrak{g} = \mathfrak{g}(\mathrm{G}) = T_e \mathrm{G}$$.
</div>

The reason for choosing the identity is that it is the one element every group is guaranteed to have.

### The Lie algebras of matrix groups

We now derive the tangent spaces and the Lie algebras of the matrix groups of the previous part.

**The general linear group, $$\mathrm{GL}_n(\mathbb{R})$$.** Let $$A \in \mathrm{M}_n(\mathbb{R})$$ and $$g \in \mathrm{GL}_n(\mathbb{R})$$, and consider the path $$\gamma(t) = g \exp(At)$$, where $$\exp$$ is the matrix exponential. First, the path stays in the group, since

$$
\det\big(g \exp(At)\big) = \det(g) \det\big(\exp(At)\big) = \det(g)\, e^{t \operatorname{tr}(A)} \neq 0,
$$

because $$\det(g) \neq 0$$ and the exponential is never zero. Second, $$\gamma(0) = g$$, and third, the path is differentiable, with $$\dot\gamma(0) = gA$$. Since $$A$$ can be any matrix, and every tangent vector arises this way, the tangent space at $$g$$ and the Lie algebra (the tangent space at $$e = I_n$$) are

$$
\begin{aligned}
T_g \mathrm{GL}_n(\mathbb{R}) &= \{ gA \mid A \in \mathrm{M}_n(\mathbb{R}) \}, \\
\new{\mathfrak{gl}_n(\mathbb{R})} &= \mathrm{M}_n(\mathbb{R}).
\end{aligned}
$$

An $$n \times n$$ matrix has $$n^2$$ entries, each a free degree of freedom, so $$\dim(\mathfrak{gl}_n(\mathbb{R})) = n^2$$, and therefore $$\dim(\mathrm{GL}_n(\mathbb{R})) = n^2$$. This is really cool! The definition of $$\mathrm{GL}_n(\mathbb{R})$$ imposes the constraint $$\det(A) \neq 0$$, so we might expect fewer than $$n^2$$ degrees of freedom, but an inequality constraint only removes a "thin" set of matrices and does not reduce the dimension.

**The affine group, $$\mathrm{Aff}_n(\mathbb{R})$$.** Let $$A = \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix}$$ with $$V \in \mathrm{M}_n(\mathbb{R})$$ and $$v \in \mathbb{R}^n$$, and consider the path

$$
\gamma(t) = g \exp(At) = g \begin{bmatrix} \exp(Vt) & \left(\int_0^t \exp(Vs)\, \mathrm{d}s\right) v \\ 0 & 1 \end{bmatrix}, \qquad g \in \mathrm{Aff}_n(\mathbb{R}).
$$

Since the group is closed under multiplication and $$g$$ is in the group, we only need the matrix on the right to be in $$\mathrm{Aff}_n(\mathbb{R})$$: its top-left block must be in $$\mathrm{GL}_n(\mathbb{R})$$ and its top-right block in $$\mathbb{R}^n$$. The latter is obvious, and we showed above that $$\det(\exp(Vt)) \neq 0$$. Again $$\gamma(0) = g$$ and $$\dot\gamma(0) = gA$$, so

$$
\begin{aligned}
T_g \mathrm{Aff}_n(\mathbb{R}) &= \left\{ g \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathrm{M}_n(\mathbb{R}),\ v \in \mathbb{R}^n \right\}, \\
\new{\mathfrak{aff}_n(\mathbb{R})} &= \left\{ \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathrm{M}_n(\mathbb{R}),\ v \in \mathbb{R}^n \right\}.
\end{aligned}
$$

The tangent spaces of $$\mathrm{Trans}_n(\mathbb{R})$$ and its Lie algebra $$\new{\mathfrak{trans}_n(\mathbb{R})}$$ are the special case $$V = 0$$.

**The orthogonal group, $$\mathrm{O}(n)$$.** Let $$A \in \mathrm{M}_n(\mathbb{R})$$, $$g \in \mathrm{O}(n)$$ and $$\gamma(t) = g \exp(At)$$. We already know that $$\gamma(t) \in \mathrm{GL}_n(\mathbb{R})$$, so $$\gamma(t) \in \mathrm{O}(n)$$ comes down to $$\gamma(t)^\top \gamma(t) = I$$. Since $$g^\top g = I$$,

$$
\gamma(t)^\top \gamma(t) = \exp(A^\top t)\, g^\top g \exp(At) = \exp(A^\top t) \exp(At).
$$

If $$A^\top = -A$$, that is, if $$A$$ is skew-symmetric, then $$\exp(A^\top t) = \exp(-At) = \exp(At)^{-1}$$ and the product is $$I$$, so the path stays in $$\mathrm{O}(n)$$. Conversely, differentiating $$\gamma(t)^\top \gamma(t) = I$$ at $$t = 0$$ gives $$A^\top + A = 0$$, so every tangent vector is of this form. Therefore

$$
\begin{aligned}
T_g \mathrm{O}(n) &= \{ gA \mid A \in \mathrm{M}_n(\mathbb{R}),\ A^\top = -A \}, \\
\new{\mathfrak{o}(n)} &= \{ A \mid A \in \mathrm{M}_n(\mathbb{R}),\ A^\top = -A \}.
\end{aligned}
$$

$$\mathrm{O}(n)$$ consists of two separate pieces (connected components), $$\mathrm{SO}(n) = \mathrm{O}(n)^+$$ and $$\mathrm{O}(n)^-$$, and paths starting at a rotation never leave the rotations: $$\det(g \exp(At)) = \det(g)\, e^{t \operatorname{tr}(A)}$$ changes continuously and cannot jump from $$1$$ to $$-1$$. Since the identity lies in $$\mathrm{SO}(n)$$, the two groups have the same Lie algebra:

$$
\begin{aligned}
T_g \mathrm{SO}(n) &= \{ gA \mid A \in \mathrm{M}_n(\mathbb{R}),\ A^\top = -A \}, \qquad g \in \mathrm{SO}(n), \\
\new{\mathfrak{so}(n)} &= \{ A \mid A \in \mathrm{M}_n(\mathbb{R}),\ A^\top = -A \}.
\end{aligned}
$$

The reflections $$\mathrm{O}(n)^-$$ do not contain the identity, so they are not a group and have no Lie algebra of their own (although the tangent spaces at reflections are still $$g\,\mathfrak{o}(n)$$). A skew-symmetric matrix has $$n^2$$ entries; the $$n$$ diagonal entries are zero, and the entries below the diagonal are the negatives of those above it. So only the $$\frac{n^2 - n}{2}$$ entries above the diagonal are free, and

$$
\dim(\mathrm{SO}(n)) = \dim(\mathfrak{so}(n)) = \frac{n(n - 1)}{2}.
$$

For $$n = 3$$, this gives the familiar $$3$$ degrees of freedom of a rotation.

**The isometry group, $$\mathrm{Isom}_n(\mathbb{R})$$.** Let $$A = \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix}$$ with $$V \in \mathfrak{o}(n)$$ and $$v \in \mathbb{R}^n$$, and consider $$\gamma(t) = g \exp(At)$$ with $$g \in \mathrm{Isom}_n(\mathbb{R})$$. As for the affine group, we only need the top-left block $$\exp(Vt)$$ of $$\exp(At)$$ to be in $$\mathrm{O}(n)$$, which holds because $$V$$ is skew-symmetric. Again $$\gamma(0) = g$$ and $$\dot\gamma(0) = gA$$, so

$$
\begin{aligned}
T_g \mathrm{Isom}_n(\mathbb{R}) &= \left\{ g \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathfrak{o}(n),\ v \in \mathbb{R}^n \right\}, \\
\new{\mathfrak{isom}_n(\mathbb{R})} &= \left\{ \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathfrak{o}(n),\ v \in \mathbb{R}^n \right\}.
\end{aligned}
$$

**The special Euclidean group, $$\mathrm{SE}(n)$$.** In the same way,

$$
\begin{aligned}
T_g \mathrm{SE}(n) &= \left\{ g \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathfrak{so}(n),\ v \in \mathbb{R}^n \right\}, \\
\new{\mathfrak{se}(n)} &= \left\{ \begin{bmatrix} V & v \\ 0 & 0 \end{bmatrix} \;\middle|\; V \in \mathfrak{so}(n),\ v \in \mathbb{R}^n \right\}.
\end{aligned}
$$

**The group of $$k$$-direct isometries, $$\mathrm{SE}_k(n)$$.** Similarly,

$$
\new{\mathfrak{se}_k(n)} = \left\{ \begin{bmatrix} V & v_1 & v_2 & \cdots & v_k \\ 0 & 0 & 0 & \cdots & 0 \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & 0 & \cdots & 0 \end{bmatrix} \;\middle|\; V \in \mathfrak{so}(n),\ v_1, \dots, v_k \in \mathbb{R}^n \right\},
$$

and $$T_g \mathrm{SE}_k(n) = \{ g X \mid X \in \mathfrak{se}_k(n) \}$$.

### Two things to remember

**The best path.** For every matrix group, the path we used was a matrix exponential. This is not a coincidence: in the next part, we will see that the exponential is exactly the map from the Lie algebra to the group.

**All tangent spaces look alike.** In every example, $$T_g \mathrm{G} = g\, \mathfrak{g}$$: to move from the Lie algebra to the tangent space at another point $$g$$, we simply pre-multiply by $$g$$. The map $$X \mapsto gX$$ is a linear isomorphism between $$\mathfrak{g}$$ and $$T_g \mathrm{G}$$, so all tangent spaces have the same structure as the Lie algebra. If $$\rho^\wedge \in \mathfrak{g}$$ and $$\dot\gamma(0) \in T_g \mathrm{G}$$ correspond to each other, then

$$
\dot\gamma(0) = g \rho^\wedge \iff \rho^\wedge = g^{-1} \dot\gamma(0). \tag{2}
$$

This relation between a tangent space and the Lie algebra should not be confused with the adjoint map, which we meet in the last part. The $$\wedge$$ notation marks an element of the Lie algebra and is defined formally in the next part. Throughout this note, $$\rho^\wedge$$ denotes an element of the Lie algebra and $${}^{g}\!\rho^\wedge$$ an element of the tangent space at $$g$$:

$$
\rho^\wedge \in \mathfrak{g} = T_e \mathrm{G}, \qquad {}^{g}\!\rho^\wedge \in T_g \mathrm{G}.
$$
