export function Duration({ ms }) {
  if (ms == 0) {
    return "";
  }
  var val;
  var unit;
  if (ms < 1000) {
    val = ms.toFixed();
    unit = "ms";
  } else if (ms < 1000 * 60) {
    val = (ms / 1000).toFixed();
    unit = "s";
  } else if (ms < 1000 * 60 * 60) {
    val = (ms / 1000 / 60).toFixed();
    unit = "m";
  } else {
    val = (ms / 1000 / 60 / 6).toFixed(1);
    unit = "h";
  }
  return (
    <>
      <span className="text-lg">{val}</span>
      <span className="text-gray-500 text-light text-xs">{unit}</span>
    </>
  );
}

export function Percentage({ val, upper, lower }) {
  if (upper != null && lower != null) {
    val = (lower / upper) * 100;
  }
  if (Math.round(val) != val) {
    val = val.toFixed(1);
  }
  if (val == null) {
    return <span className="text-gray-500 text-light text-xs">-</span>;
  }
  return (
    <>
      <span className="text-lg">{val}</span>
      <span className="text-gray-500 text-light text-xs">%</span>
    </>
  );
}

export function is_empty(val) {
  return val == null || val == "";
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}