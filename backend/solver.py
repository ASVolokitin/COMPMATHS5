from decimal import Decimal
import numpy as np
from typing import List, Dict

from backend.solvers.gauss_interpolation import gauss_solve
from backend.solvers.lagrange_interpolation import lagrange_solve
from backend.solvers.newton_interpolation import newton_solve
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

    # solutions = {}
    # solutions["lagrange"] = lagrange_solve(data)
    # solutions["quadratic"] = quadratic_solve(data)
    # solutions["cubic"] = cubic_solve(data)
    # solutions["exponential"] = exponential_solve(data)
    # solutions["logarithmic"] = logarithmic_solve(data)
    # solutions["power"] = power_solve(data)
    
    # min_mse = abs(solutions["linear"].mse)
    # for solution in solutions.values(): 
    #     if solution.calculation_success: min_mse = min(min_mse, abs(solution.mse))
    # for solution in solutions.values():
    #     if abs(solution.mse) == min_mse and solution.calculation_success:
    #         solution.best_approximation = True
    #         break

def solve_approximation(data: DataInput):
    return solve_all(data)