---
layout: project
title: "Invariant EKF"
start: 2023-11
categories:
  - state-estimation
summary: "Invariant extended Kalman filters for a unicycle robot with and without additive disturbances, compared with the EKF and UKF."
thumbnail: cover.png
math: true
links:
  - label: "Code"
    url: "https://github.com/mhyoosefian/IEKF"
cite_intro: "This project is based on the following paper. If you use the code in your research, please cite:"
cite_external:
  - text: "K. Coleman, H. Bai and C. N. Taylor. “Extended invariant-EKF designs for state and additive disturbance estimation.” <cite>Automatica</cite>, 125, 109464, 2021."
    bibtex: |
      @article{coleman2021extended,
        title={Extended invariant-EKF designs for state and additive disturbance estimation},
        author={Coleman, Kevin and Bai, He and Taylor, Clark N},
        journal={Automatica},
        volume={125},
        pages={109464},
        year={2021},
        publisher={Elsevier}
      }
---

<p class="project-lead">The extended Kalman filter (EKF) is the workhorse of state estimation, but it linearizes the dynamics around the current estimate and offers no global convergence guarantees. The <strong>invariant EKF (IEKF)</strong> is a symmetry-preserving alternative: by defining the estimation errors in coordinates that respect the symmetries of the system, its error dynamics depend only on the error itself and a set of invariants, not on the trajectory. In this project, I implemented the EKF, the unscented Kalman filter (UKF) and the IEKF for a unicycle robot, and reproduced two IEKF designs for estimating the state together with additive disturbances.</p>

## The problem

The robot is a unicycle with position $$(x, y)$$, heading $$\theta$$, linear velocity $$v$$ and turning rate $$\omega$$, subject to a disturbance $$d \in \mathbb{R}^4$$ with linear dynamics:

$$
\dot x = v\cos\theta + C_x d, \qquad
\dot y = v\sin\theta + C_y d, \qquad
\dot\theta = \omega, \qquad
\dot d = A d .
$$

Only noisy measurements of the position $$(x, y)$$ are available. The pose $$(x, y, \theta)$$ evolves on the special Euclidean group $$SE(2)$$, and the system is invariant under its group actions: rotating and translating the robot leaves the form of the equations unchanged.

## Why invariant filtering

The EKF uses the plain difference between the estimate and the true state as its error. The IEKF instead uses an invariant error, in which the position error is expressed in the robot’s own frame. For the unicycle, this makes the linearized error dynamics independent of the estimated heading, so the filter does not suffer from linearizing around a poor estimate. The undisturbed example shows this clearly.

When a disturbance is added, the system stays invariant only if the disturbance transforms appropriately under the group action. Two designs achieve this: in **IEKF 1**, the disturbance itself is left unchanged and the input matrices $$C_x, C_y$$ are transformed with the robot; in **IEKF 2**, the disturbance is rotated with the robot and the input matrices stay fixed, which requires additional conditions on the disturbance dynamics.

## Results

<div class="figure-tabs">
  <div class="figure-tabs-bar" role="group" aria-label="Scenario" hidden>
    <button type="button" data-tab="undisturbed">Without disturbance</button>
    <button type="button" data-tab="disturbed">With disturbance</button>
  </div>
  <div data-panel="undisturbed">
    <div class="figure-grid cols-2">
      <figure><img src="undisturbed-x.png" alt="RMSE of x for EKF, IEKF and UKF without disturbance" loading="lazy"><figcaption>Position error (x)</figcaption></figure>
      <figure><img src="undisturbed-theta.png" alt="RMSE of theta for EKF, IEKF and UKF without disturbance" loading="lazy"><figcaption>Heading error (θ)</figcaption></figure>
    </div>
    <p>Without disturbance, the <strong>IEKF clearly outperforms the EKF and UKF</strong>: its position error stays lower throughout the run, and its heading error stays small from the start, while the EKF and UKF show a large transient.</p>
  </div>
  <div data-panel="disturbed">
    <div class="figure-grid cols-2">
      <figure><img src="disturbed-theta.png" alt="RMSE of theta for EKF, IEKF 1, IEKF 2 and UKF with disturbance" loading="lazy"><figcaption>Heading error (θ)</figcaption></figure>
      <figure><img src="disturbed-d2.png" alt="RMSE of the disturbance component d2 for EKF, IEKF 1, IEKF 2 and UKF" loading="lazy"><figcaption>Disturbance error (d₂)</figcaption></figure>
    </div>
    <p>With disturbance, both IEKF designs avoid the large initial transient of the EKF and UKF in the heading and disturbance estimates. In the long run, however, the EKF and UKF reach slightly lower disturbance errors, so this example only partially reproduces the results reported in the original paper.</p>
  </div>
</div>
<p class="figure-note">Click any figure to enlarge it.</p>

## Takeaways

- Invariant filtering exploits the symmetry of the system: it is consistent with the system’s geometry, makes convergence easier to analyze, and can significantly improve performance.
- It is not applicable to every estimation problem, there is no systematic recipe for choosing the transformations, and in my experiments the IEKF was sensitive to the process noise.
