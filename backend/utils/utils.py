from decimal import Decimal
import math
from typing import List, Tuple

import numpy as np

from backend.utils.constants import GRAPH_PARTITIONS_AMOUNT
from backend.utils.exceptions import UnequallySpacedXException


def generate_graph_points(x: List[Decimal], func, errors) -> Tuple[List[Decimal], List[Decimal]]:
    try:
        # x_plot = np.linspace(min(x) - min(Decimal(2), abs(min(x)) * Decimal(0.4)), max(x) + min(Decimal(2), abs(max(x)) * Decimal(0.4)), GRAPH_PARTITIONS_AMOUNT)
        x_plot = np.linspace(min(x), max(x), GRAPH_PARTITIONS_AMOUNT)
        try:
            y_plot = [func(x) for x in x_plot]
        except ZeroDivisionError:
            errors.append("Impossible to calculate graph points over the entire interval.")
            return None

        x_plot_decimal = [Decimal(str(xi)) for xi in x_plot]
        y_plot_decimal = [Decimal(str(yi)) for yi in y_plot]

        return x_plot_decimal, y_plot_decimal

    except ZeroDivisionError:
        errors.append("Zero deivision error occured while calculating points for graph.")
        return None
    except OverflowError:
        errors.append("Overflow error occured while calculating points for graph.")
        return None
    except TypeError:
        errors.append("It is impossible to calculate the points for the graph (approximation function is undefined).")
        return None
    
def is_number(value):
    if isinstance(value, (int, float)):
        return True
    if isinstance(value, str):
        try:
            float(value)
            return True
        except ValueError:
            return False
    return False

def validate_polynomial(x, polynomial):
    return polynomial(x)

def validate_uniform_grid(x_arr: List[Decimal]) -> None:
    h = x_arr[1] - x_arr[0]
    for i in range(2, len(x_arr)):
        if not abs((x_arr[i] - x_arr[i - 1]) - h) < 1e-10:
            raise UnequallySpacedXException()