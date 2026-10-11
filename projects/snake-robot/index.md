---
layout: project
title: "Snake Robot Equations of Motion"
start: 2020-08
categories:
  - dynamics
summary: "Equations of motion of a four-link wheeled snake robot with nonholonomic constraints, derived and solved with eight methods (from Lagrange multipliers to Kane and Gibbs–Appell) and compared in accuracy, run time and the size of the equations, with a 3D animation of the simulated motion."
thumbnail: cover.jpg
math: true
links:
  - label: "Code"
    url: "https://github.com/mhyoosefian/Snake-Robot"
cite: volterra
---

<p class="project-lead">A snake robot moves forward without pushing against anything: wheels on each link let it roll along the link but not sideways, and these <strong>nonholonomic constraints</strong> turn its bending into forward motion. In this project, I derived the equations of motion of a four-link snake robot with torsional springs at its joints and solved them with <strong>eight different methods</strong>, from Lagrange multipliers to the Kane and Gibbs–Appell equations, and compared them in accuracy, run time and the size of the equations.</p>

{% include project-local-video.html src="snake-robot.mp4" poster="poster.jpg" caption="Simulated motion (\(2\times\) speed). The robot starts at rest with its springs twisted. As the springs unwind, the wheels convert the bending into forward motion, head first, until the robot is straight and glides at a constant \(0.4\) m/s. The brown lines are the wheel tracks." %}

## Model

The configuration is described by the position $$(x, y)$$ of the center of mass of the first link and the absolute angles $$\theta_1, \dots, \theta_4$$ of the four links, six generalized coordinates in total. The wheels at the center of mass $$G_i$$ of each link cannot slip sideways, which gives four constraints on the velocities,

$$
v_{G_i} \cdot n_i = 0, \qquad n_i = [-\sin\theta_i \ \ \cos\theta_i]^\top, \qquad i = 1, \dots, 4,
$$

so the robot has only two degrees of freedom. These constraints restrict the velocities but cannot be integrated into constraints on the configuration. The joints carry torsional springs with stiffnesses $$k_1, k_2, k_3$$, so the Lagrangian is

$$
\mathcal{L} = \sum_{i=1}^{4} \tfrac{1}{2}\left(m_i \|v_{G_i}\|^2 + I_i \dot\theta_i^2\right) - \sum_{j=1}^{3} \tfrac{1}{2} k_j (\theta_{j+1} - \theta_j)^2 .
$$

## Eight methods

- **Integrated multipliers, augmented, elimination and Greenwood:** Lagrange’s equations with Lagrange multipliers for the constraints, solved in different ways (with the multipliers as unknowns, eliminated using part of the equations, or computed explicitly).
- **Embedding:** two generalized velocities ($$\dot x$$ and $$\dot\theta_4$$) are chosen as independent and the others are written in terms of them, leaving two equations.
- **Modified Lagrange, Gibbs–Appell and Kane:** two quasi-velocities, the speed of the first link along its axis and its turning rate, describe the motion directly, so the constraints are satisfied by construction. Gibbs–Appell is based on the “acceleration energy” (Gibbs function) of the system, and Kane uses partial velocities and generalized inertia forces; both lead to the same equations as the modified Lagrange method.

## Comparison

All eight methods give the same motion to within $$10^{-13}$$. Without external forces, the mechanical energy must stay constant and the constraints must remain satisfied, so their drift over a $$5$$-second simulation with MATLAB’s `ode45` measures the accuracy of each method (run times are the median of five runs):

<table class="project-table is-centered">
  <thead><tr><th>Method</th><th>Matrix inverted</th><th>Run time (s)</th><th>Constraint error</th><th>Energy error (%)</th></tr></thead>
  <tbody>
    <tr><td>Integrated multipliers</td><td>16 × 16</td><td>0.80</td><td>7.0e-14</td><td>2.5e-11</td></tr>
    <tr><td>Augmented</td><td>10 × 10</td><td>0.74</td><td>7.0e-14</td><td>2.5e-11</td></tr>
    <tr><td>Elimination</td><td>6 × 6</td><td>0.74</td><td>4.5e-14</td><td>1.3e-10</td></tr>
    <tr><td>Greenwood</td><td>6 × 6</td><td>1.03</td><td>5.9e-14</td><td class="best">2.4e-11</td></tr>
    <tr><td>Embedding</td><td>2 × 2</td><td>0.77</td><td>5.5e-15</td><td>2.7e-11</td></tr>
    <tr><td>Modified Lagrange</td><td class="best">2 × 2</td><td class="best">0.71</td><td class="best">2.6e-15</td><td>4.9e-11</td></tr>
    <tr><td>Gibbs–Appell</td><td>2 × 2</td><td>0.72</td><td class="best">2.6e-15</td><td>5.0e-11</td></tr>
    <tr><td>Kane</td><td>2 × 2</td><td>0.75</td><td class="best">2.6e-15</td><td>4.9e-11</td></tr>
  </tbody>
</table>

The methods based on quasi-velocities (and embedding) keep the constraints an order of magnitude more accurately, because the constraints are built into their equations instead of being enforced at the acceleration level, and they only need to invert a $$2 \times 2$$ matrix. The multiplier-based methods are simpler to derive, but they carry all six coordinates and four multipliers, and the elimination method also needs a part of the constraint Jacobian to be invertible. Among the quasi-velocity methods, Kane’s is the simplest to derive, since it needs neither the Gibbs function nor its derivatives.

## Takeaways

- Nonholonomic constraints are what make a snake robot move: with sideways slip prevented, simply releasing the springs propels it forward.
- With a good choice of quasi-velocities, a six-coordinate constrained system reduces to two first-order equations, with the constraints satisfied by construction.
- Checking energy conservation and the constraints is a simple and effective way to verify derived equations of motion; here eight different formulations agree to within $$10^{-13}$$.
