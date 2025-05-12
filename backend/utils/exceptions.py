class unequallySpacedXException(Exception):
     def __init__(self, message=None):
        if message is None:
            message = "X values must be equidistant."
        super().__init__(message)