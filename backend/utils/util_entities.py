from decimal import Decimal
from typing import Callable, List
from enum import Enum

class ErrorCodes(str, Enum):
    UNABLE_TO_CALCULATE_GRAPH_POINTS="Couldn't calculate graph points."
    UNABLE_TO_CALCULATE_FINITE_DIFFERENCES="Couldn't calculate finite differences."
    UNABLE_TO_CALCULATE_TARGET_Y="Couldn't calculate target Y."
    UNABLE_TO_CALCULATE_STIRLING="Couldn't calculate target Y via Stirling (unequally spaced X)."
    POLYNOMIAL_ZERO_DEVISION="Couldn't calculate polynomial coefficients (Zero devision error)."
    LAGRANGE_ZERO_DEVISION="Couldn't calculate Lagrange polynomial coefficients."
    NEWTON_ZERO_DEVISION="Couldn't calculate Newton devided differences (Zero devision error)."
    POLYNOMIAL_VALUE_ERROR="Couldn't calculate polynomial coefficients (Value error)."
    UNEQUALLY_SPACED_X="All X values should be equally spaced."

class InterpolationMethods(str, Enum):
    LAGRANGE="Lagrange"
    NEWTON="Newton"
    GAUSS="Gauss"
    STIRLING="Stirling"
    BESSEL="Bessel"

class GaussFormula(str, Enum):
    FIRST="fisrt"
    SECOND="second"