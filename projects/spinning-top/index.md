---
layout: project
title: "Spinning Top Equations of Motion"
start: 2020-08
categories:
  - dynamics
summary: "Equations of motion of a spinning top derived four ways (Lagrange and modified Lagrange, with Euler angles and with quaternions), compared in accuracy, run time, singularities and simplicity, with a 3D animation of the simulated motion."
thumbnail: cover.jpg
math: true
links:
  - label: "Code"
    url: "https://github.com/mhyoosefian/Spinning-Top"
cite: volterra
---

<p class="project-lead">A spinning top is one of the simplest systems that shows the rich behavior of rigid-body rotation: it spins about its own axis, <strong>precesses</strong> around the vertical and <strong>nutates</strong> up and down, and once friction has taken away enough of its spin, it falls. In this project, I derived its equations of motion <strong>in four ways</strong>, with the Lagrange and modified Lagrange (quasi-velocity) methods and with Euler angles and quaternions as coordinates, and compared them in accuracy, run time, singularities and the complexity of the resulting equations.</p>

{% include project-local-video.html src="spinning-top.mp4" poster="poster.jpg" caption="Simulated motion of a \(6\) cm toy top (\(4\times\) slow motion), with its mass and inertia computed from its shape. It starts at \(24\) rev/s and \(8^\circ\) of tilt; a small friction torque slowly reduces its spin, so it precesses faster and leans further until its rim touches the floor. The blue line traces the tip of the stem." %}

## Model

The top touches the floor at a fixed point $$O$$ (a ball joint), so it has three degrees of freedom. Its orientation is described either by the ZYZ Euler angles $$(\psi, \theta, \phi)$$ (precession, tilt and spin) or by the four Euler parameters (quaternions) $$e_0, \dots, e_3$$, which must satisfy the constraint $$e_0^2 + e_1^2 + e_2^2 + e_3^2 = 1$$. With $$h$$ the distance of the center of mass from $$O$$, the Lagrangian is

$$
\mathcal{L} = \tfrac{1}{2}\, m\, \|v_G\|^2 + \tfrac{1}{2}\, \omega^\top I\, \omega - m g h \cos\theta ,
$$

and a torque $$M_z$$ about the symmetry axis can drive the spin (or, with a negative sign, act as friction).

## Four ways to the same motion

- **Lagrange with Euler angles:** three second-order equations in $$(\psi, \theta, \phi)$$.
- **Modified Lagrange with Euler angles:** the three components of the angular velocity are chosen as quasi-velocities, which gives first-order equations in the angular velocity.
- **Lagrange with quaternions:** four coordinates and one constraint, solved with a Lagrange multiplier.
- **Modified Lagrange with quaternions:** the angular velocity again as quasi-velocities, with the constraint embedded in the kinematics.

The choice of quasi-velocities makes a big difference in the complexity of the equations. With Euler angles, the mass matrix of the Lagrange method depends on the tilt, while that of the modified Lagrange method is constant and diagonal:

$$
M_L = \begin{bmatrix} I_{zz} + (I_{xx} - I_{zz} + m h^2)\sin^2\theta & 0 & I_{zz}\cos\theta \\ 0 & I_{yy} + m h^2 & 0 \\ I_{zz}\cos\theta & 0 & I_{zz} \end{bmatrix},
$$

$$
M_{ML} = \begin{bmatrix} I_{xx} + m h^2 & 0 & 0 \\ 0 & I_{yy} + m h^2 & 0 \\ 0 & 0 & I_{zz} \end{bmatrix}.
$$

## Comparison

All four formulations were simulated for $$5$$ seconds with MATLAB’s `ode45`, with a constant driving torque (run times are the median of five runs). Since the torque is the only input, the rate of change of the mechanical energy must equal the input power, and the error of this power balance (and, for quaternions, the violation of the constraint) measures the accuracy of each method:

<table class="project-table is-centered">
  <thead><tr><th>Method</th><th>Run time (s)</th><th>Power error</th><th>Constraint error</th></tr></thead>
  <tbody>
    <tr><td>Lagrange, Euler angles</td><td>0.44</td><td>5.6e-14</td><td>–</td></tr>
    <tr><td>Modified Lagrange, Euler angles</td><td class="best">0.42</td><td class="best">2.9e-14</td><td>–</td></tr>
    <tr><td>Lagrange, quaternions</td><td>0.50</td><td>4.5e-11</td><td>6.9e-14</td></tr>
    <tr><td>Modified Lagrange, quaternions</td><td>0.45</td><td>5.1e-13</td><td class="best">1.8e-15</td></tr>
  </tbody>
</table>

The modified Lagrange method is faster and more accurate than the standard one with either set of coordinates. The Euler-angle formulations are faster here, because the trigonometric terms are evaluated only once per step and the equations are written in a frame that does not spin with the top, but they have a **singularity at $$\theta = 0$$**, when the top stands exactly upright: the first and third rotations are then about the same axis. The quaternion formulations have no singularity at all, at the price of longer equations and a constraint that must be maintained.

## Takeaways

- The same system can lead to equations of very different complexity: a good choice of quasi-velocities turned the mass matrix into a constant, diagonal one.
- Euler angles are intuitive and fast, but singular for an upright top, exactly where a top spends most of its time; quaternions avoid this.
- Checking the power balance (or the energy, without inputs) is a simple and effective way to verify derived equations of motion.
