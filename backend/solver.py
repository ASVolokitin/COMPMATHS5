from decimal import Decimal
import numpy as np
from typing import List, Dict

from backend.solvers.gauss_interpolation import gauss_solve
from backend.solvers.lagrange_interpolation import lagrange_solve
from backend.solvers.newton_interpolation import newton_solve
from backend.utils.calculation_utils import bessel_interpolation
from backend.utils.http_entities import DataInput

def solve_all(data: DataInput):
    solutions = {}
    lagrange = lagrange_solve(data=data)
    newton = newton_solve(data=data)
    gauss = gauss_solve(data=data)

    solutions["lagrange"] = lagrange
    solutions["newton"] = newton
    solutions["gauss"] = gauss

    return solutions

def solve_approximation(data: DataInput):
    return solve_all(data)