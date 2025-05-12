from decimal import Decimal
from typing import Callable, List
from backend.utils.http_entities import DataInput
from enum import Enum

class ErrorCodes(str, Enum):
    UNABLE_TO_CALCULATE_COEFFICIENTS="The coefficients of the approximating function could not be calculated."
    UNABLE_TO_CALCULATE_GRAPH_POINTS="Couldn't calculate graph points."
    UNABLE_TO_CALCULATE_FINITE_DIFFERENCES="Couldn't calculate finite differences."
    UNABLE_TO_CALCULATE_TARGET_Y="Couldn't calculate target Y."
    POLINOMIAL_ZERO_DEVISION="Couldn't calculate polynomial coefficients (Zero devision error)."
    POLINOMIAL_VALUE_ERROR="Couldn't calculate polynomial coefficients (Value error)."

class InterpolationMethods(str, Enum):
    LAGRANGE="Lagrange"
    NEWTON="Newton"
    GAUSS="Gauss"