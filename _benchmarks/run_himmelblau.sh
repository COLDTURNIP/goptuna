#!/bin/sh

set -e

KUROBAKO=${KUROBAKO:-kurobako}

# go build -o ./cma_solver ./_benchmarks/cma_solver/main.go
go build -o ./tpe_solver ./_benchmarks/tpe_solver/main.go
go build -o ./himmelblau_problem ./_benchmarks/himmelblau_problem/main.go

RANDOM_SOLVER=$($KUROBAKO solver random)

# kurobako-go don't still support relative sampler.
# CMA_SOLVER=$($KUROBAKO solver command ./cma_solver)

TPE_SOLVER=$($KUROBAKO solver command ./tpe_solver)
OPTUNA_SOLVER=$($KUROBAKO solver command python ./_benchmarks/optuna_solver/cmaes.py)
PROBLEM=$($KUROBAKO problem command ./himmelblau_problem)

$KUROBAKO studies \
  --solvers $RANDOM_SOLVER $TPE_SOLVER $OPTUNA_SOLVER \
  --problems $PROBLEM \
  --repeats 8 --budget 300 \
  | $KUROBAKO run --parallelism 1 > $1
