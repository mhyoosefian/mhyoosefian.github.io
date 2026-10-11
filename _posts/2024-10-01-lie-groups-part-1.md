---
layout: post
title: "Groups and matrix groups"
date: 2024-10-01
permalink: /blog/lie-groups/groups-and-matrix-groups/
series: lie-groups
series_title: "A Short Note on Lie Groups"
series_summary: "A short tutorial on matrix Lie groups for robotics and state estimation: groups, tangent spaces and Lie algebras, the exponential map, and the adjoint."
part: 1
summary: "What a group is, how groups act on sets, and the matrix groups used in robotics."
math: true
---

## 1. Introduction

In this note, we explain matrix Lie groups with a focus on their applications in robotics. Lie groups are abstract mathematical objects, but here the focus is on the parts that are relevant to robotics, and specifically to state estimation. For a complete tutorial, see the lecture notes of Maani Ghaffari’s course [ROB 530: Mobile Robotics](https://github.com/UMich-CURLY-teaching/UMich-ROB-530-public) at the University of Michigan.

The main reason for using matrix Lie groups in robotics is that they are convenient! We would always rather work in flat spaces than in curved ones. Roughly speaking, this is why we use them: they let us map a curved space to a flat space, where doing calculus is easier. The first parts of this note might seem abstract, but as we approach the end, everything comes together. So make sure to stick around until the end!

## 2. Group definition and examples

We want to talk about *matrix Lie groups*, so we first need to know what a *group* is.

<div class="post-def" markdown="block">
**Definition (group).** A group $$(\mathrm{G}, \circ)$$ is a non-empty set $$\mathrm{G}$$ together with an operator $$\circ$$ that satisfies the following properties.

- **Closure:** if $$g_1, g_2 \in \mathrm{G}$$, then $$g_1 \circ g_2 \in \mathrm{G}$$.
- **Associativity:** for all $$g_1, g_2, g_3 \in \mathrm{G}$$, $$(g_1 \circ g_2) \circ g_3 = g_1 \circ (g_2 \circ g_3)$$.
- **Identity:** there is a unique identity element $$e \in \mathrm{G}$$ such that $$e \circ g = g \circ e = g$$ for all $$g \in \mathrm{G}$$.
- **Inverse:** for every $$g \in \mathrm{G}$$, there is an element $$g^{-1} \in \mathrm{G}$$ such that $$g^{-1} \circ g = g \circ g^{-1} = e$$.
</div>

Note that the operation need not be commutative: in general, $$g_1 \circ g_2 \neq g_2 \circ g_1$$.

The operator $$\circ$$ acts on two elements of the group. In addition to this internal operation, a group can transform the elements of other sets by *acting* on them.

<div class="post-def" markdown="block">
**Definition (left group action).** Given a group $$\mathrm{G}$$ and a set $$\mathcal{V}$$, we denote by $$g \cdot v$$ the left action of $$g \in \mathrm{G}$$ on $$v \in \mathcal{V}$$. The map $$\cdot : \mathrm{G} \times \mathcal{V} \to \mathcal{V}$$ is a left group action if it satisfies

- **Identity:** $$e \cdot v = v$$, where $$e$$ is the identity of the group.
- **Compatibility:** $$(g_1 \circ g_2) \cdot v = g_1 \cdot (g_2 \cdot v)$$ for all $$g_1, g_2 \in \mathrm{G}$$.
</div>

<div class="post-def" markdown="block">
**Definition (right group action).** Given a group $$\mathrm{G}$$ and a set $$\mathcal{V}$$, we denote by $$v \cdot g$$ the right action of $$g \in \mathrm{G}$$ on $$v \in \mathcal{V}$$. The map $$\cdot : \mathcal{V} \times \mathrm{G} \to \mathcal{V}$$ is a right group action if it satisfies

- **Identity:** $$v \cdot e = v$$.
- **Compatibility:** $$(v \cdot g_1) \cdot g_2 = v \cdot (g_1 \circ g_2)$$ for all $$g_1, g_2 \in \mathrm{G}$$.
</div>

In robotics, we mostly work with matrix groups acting on vector spaces, usually from the left. The action is then the multiplication of a matrix (an element of the group) with a vector (an element of the vector space).

### Two examples

**The real numbers under addition, $$(\mathbb{R}, +)$$.**

- *Closure:* if $$a, b \in \mathbb{R}$$, then $$a + b \in \mathbb{R}$$.
- *Associativity:* $$(a + b) + c = a + (b + c)$$ for all $$a, b, c \in \mathbb{R}$$.
- *Identity:* $$e = 0$$, since $$a + 0 = 0 + a = a$$ for all $$a \in \mathbb{R}$$.
- *Inverse:* the inverse of $$a$$ is $$-a$$, since $$a + (-a) = 0 = e$$.

**The non-zero real numbers under multiplication, $$(\mathbb{R}^*, \cdot)$$.**

- *Closure:* if $$a, b \in \mathbb{R}^*$$, then $$a \cdot b \in \mathbb{R}^*$$.
- *Associativity:* $$(a \cdot b) \cdot c = a \cdot (b \cdot c)$$ for all $$a, b, c \in \mathbb{R}^*$$.
- *Identity:* $$e = 1$$, since $$a \cdot 1 = 1 \cdot a = a$$ for all $$a \in \mathbb{R}^*$$.
- *Inverse:* the inverse of $$a$$ is $$\frac{1}{a} \in \mathbb{R}^*$$, since $$a \cdot \frac{1}{a} = 1 = e$$. This is why $$0$$ must be excluded: it has no inverse.

## 3. Different matrix groups

A *matrix group* is a group whose elements are matrices. In robotics, the group operator of a matrix group is matrix multiplication, and we only work with real-valued matrices. From now on, when a group is defined for the first time, it is shown in $$\new{\text{emerald}}$$.

We denote the set of all $$m \times n$$ real matrices by $$\mathrm{M}_{m,n}(\mathbb{R})$$, and the set of square $$n \times n$$ real matrices by $$\mathrm{M}_n(\mathbb{R})$$. These sets are *not* groups under multiplication: a product of non-square matrices is not even defined in general, and a singular square matrix has no inverse. Keeping only the invertible matrices gives the largest matrix group we work with.

<div class="post-def" markdown="block">
**Definition (general linear group).** The general linear group is the set of invertible $$n \times n$$ matrices, with matrix multiplication as the operator:

$$
\new{\mathrm{GL}_n(\mathbb{R})} = \{ A \mid A \in \mathrm{M}_n(\mathbb{R}),\ \det(A) \neq 0 \}.
$$

</div>

The identity of this group is $$I_n$$ and the inverse of $$A$$ is $$A^{-1}$$. The group acts on a vector space as $$A \cdot v$$, where $$v \in \mathbb{R}^n$$ is a vector or a point, and the action is matrix multiplication, the same as the group operator.

<div class="post-def" markdown="block">
**Definition (affine group).** The $$n$$-dimensional affine group is

$$
\new{\mathrm{Aff}_n(\mathbb{R})} = \left\{ \begin{bmatrix} A & u \\ 0 & 1 \end{bmatrix} \;\middle|\; A \in \mathrm{GL}_n(\mathbb{R}),\ u \in \mathbb{R}^n \right\}.
$$

</div>

Its identity is $$I_{n+1}$$, and the inverse of an element is

$$
\begin{bmatrix} A & u \\ 0 & 1 \end{bmatrix}^{-1} = \begin{bmatrix} A^{-1} & -A^{-1} u \\ 0 & 1 \end{bmatrix}.
$$

The group acts on points as $$\begin{bmatrix} A & u \\ 0 & 1 \end{bmatrix} \begin{bmatrix} v \\ 1 \end{bmatrix}$$, where $$v \in \mathbb{R}^n$$. We call $$\begin{bmatrix} v \\ 1 \end{bmatrix}$$ a *homogeneous point* when $$v$$ is a point in space, and $$\begin{bmatrix} v \\ 0 \end{bmatrix}$$ a *homogeneous vector* when $$v$$ is a vector. A subgroup of $$\mathrm{Aff}_n(\mathbb{R})$$ is the translation group $$\new{\mathrm{Trans}_n(\mathbb{R})}$$, the special case with $$A = I_n$$.

<div class="post-def" markdown="block">
**Definition (orthogonal group).** The orthogonal group is

$$
\new{\mathrm{O}(n)} = \{ A \mid A \in \mathrm{GL}_n(\mathbb{R}),\ A A^\top = I_n \}.
$$

</div>

Its identity is $$I_n$$, and the inverse of $$A$$ is $$A^{-1} = A^\top$$. It acts on vectors and points by multiplication. From now on, we drop the symbols $$\circ$$ and $$\cdot$$: for all of our groups, both the operator and the action are matrix multiplication.

Since $$\det(A) = \det(A^\top)$$, the condition $$A A^\top = I_n$$ gives $$\det(A)^2 = 1$$, so $$\det(A) = \pm 1$$. This splits $$\mathrm{O}(n)$$ into two disjoint subsets,

$$
\begin{aligned}
\new{\mathrm{O}(n)^+} &= \{ A \mid A \in \mathrm{O}(n),\ \det(A) = 1 \}, \\
\new{\mathrm{O}(n)^-} &= \{ A \mid A \in \mathrm{O}(n),\ \det(A) = -1 \},
\end{aligned}
$$

the *rotations* and the *reflections*. Only the first is a group: the identity has determinant $$1$$, so it is not in $$\mathrm{O}(n)^-$$, and the product of two reflections is a rotation. The group of rotations is called the *special orthogonal group*:

$$
\new{\mathrm{SO}(n)} = \mathrm{O}(n)^+ = \{ A \mid A \in \mathrm{O}(n),\ \det(A) = 1 \}.
$$

<div class="post-def" markdown="block">
**Definition (isometry group).** The isometry group is

$$
\new{\mathrm{Isom}_n(\mathbb{R})} = \left\{ \begin{bmatrix} A & u \\ 0 & 1 \end{bmatrix} \;\middle|\; A \in \mathrm{O}(n),\ u \in \mathbb{R}^n \right\}.
$$

</div>

An *isometry* is a distance-preserving bijection. A rotation or reflection ($$A \in \mathrm{O}(n)$$) followed by a translation ($$u \in \mathbb{R}^n$$) preserves distances, hence the name. Clearly, $$\mathrm{Isom}_n(\mathbb{R}) \subseteq \mathrm{Aff}_n(\mathbb{R})$$. Keeping only the rotations gives the most important group in robotics.

<div class="post-def" markdown="block">
**Definition (special Euclidean group).** The special Euclidean group is

$$
\new{\mathrm{SE}(n)} = \left\{ \begin{bmatrix} A & u \\ 0 & 1 \end{bmatrix} \;\middle|\; A \in \mathrm{SO}(n),\ u \in \mathbb{R}^n \right\}.
$$

</div>

This is the group of rigid-body transformations: a rotation plus a translation, which preserves the distances between the points of a rigid body.

<div class="post-def" markdown="block">
**Definition (group of $$k$$-direct isometries).** The group of $$k$$-direct isometries is

$$
\new{\mathrm{SE}_k(n)} = \left\{ \begin{bmatrix} A & u_1 & u_2 & \cdots & u_k \\ 0 & 1 & 0 & \cdots & 0 \\ 0 & 0 & 1 & \cdots & 0 \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & 0 & \cdots & 1 \end{bmatrix} \;\middle|\; A \in \mathrm{SO}(n),\ u_1, \dots, u_k \in \mathbb{R}^n \right\}.
$$

</div>

This is $$\mathrm{SE}(n)$$ augmented with $$k - 1$$ extra vectors. In state estimation, the state usually contains more than a rotation and a translation, so we need such an augmented group. Its identity is $$I_{n+k}$$, and the inverse is

$$
\begin{bmatrix} A^{-1} & -A^{-1} u_1 & -A^{-1} u_2 & \cdots & -A^{-1} u_k \\ 0 & 1 & 0 & \cdots & 0 \\ 0 & 0 & 1 & \cdots & 0 \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & 0 & \cdots & 1 \end{bmatrix}.
$$

A useful example when working with IMUs is

$$
\new{\mathrm{SE}_2(3)} = \left\{ \begin{bmatrix} A & v & p \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \;\middle|\; A \in \mathrm{SO}(3),\ v, p \in \mathbb{R}^3 \right\},
$$

where $$A$$ is the rotation matrix, and $$v$$ and $$p$$ are the linear velocity and the position of the IMU.

We have now met the most important matrix groups in robotics. In the next part, we see what makes them *Lie* groups.
