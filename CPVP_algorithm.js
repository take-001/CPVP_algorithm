function n_to_coords(num, n = 31) {
              // 사각형의 번호로 몇 행 몇 열에 있는지 반환
              let i = Math.floor(num / n);
              let j = num % n;
              
              return [i, j];
              }
              
function generation_square(squarecenter, n = 31) {
                // 센터를 중심으로 가로,세로 1.5km의 정사각형을 n개의 정사각형으로 분할
                const l1 = squarecenter[0] - 0.007831555125996204*4; // 약 0.75km
                const ln1 = squarecenter[1] - 0.009677410125732422*4; // 약 0.75km
                const l2 = squarecenter[0] + 0.007831555125996204*4;
                const ln2 = squarecenter[1] + 0.009677410125732422*4;
                const square = [[l1, ln1], [l1, ln2], [l2, ln1], [l2, ln2]];
                const set_of_unitsquare = [];
              
                const step_of_l = (l2 - l1) / n;
                const step_of_ln = (ln2 - ln1) / n;
                for (let i = 0; i < n; i++) {
                  for (let j = 0; j < n; j++) {
                    const temp = [
                      [l1 + i * step_of_l, ln1 + j * step_of_ln],
                      [l1 + i * step_of_l, ln1 + (j + 1) * step_of_ln],
                      [l1 + (i + 1) * step_of_l, ln1 + (j + 1) * step_of_ln],
                      [l1 + (i + 1) * step_of_l, ln1 + j * step_of_ln]
                    ];
                    set_of_unitsquare.push(temp);
                  }
                }
                return set_of_unitsquare;
              }
              
function fit_point_to_square(point, sofsquare) {
                // 점이 해당하는 사각형의 인덱스 반환
                for (let i = 0; i < sofsquare.length; i++) {
                  if (
                    point[0] >= sofsquare[i][0][0] &&
                    point[0] <= sofsquare[i][2][0] &&
                    point[1] >= sofsquare[i][0][1] &&
                    point[1] <= sofsquare[i][2][1]
                  ) {
                    return i;
                  }
                }
              }
function generate_heatmap_by_point(point, sofsquare) {
                const n = Math.sqrt(sofsquare.length);
                const dummy = Array.from({ length: n }, () => Array(n).fill(0));
              
                const q = fit_point_to_square(point, sofsquare);
                if (q !== undefined) {
                  const [i_, j_] = n_to_coords(q, Math.sqrt(sofsquare.length));
                  let emptiness = true;
                  let x = 0;
              
                  while (emptiness) {
                    for (let i = i_ - x; i <= i_ + x; i++) {
                      for (let j = j_ - x; j <= j_ + x; j++) {
                        if (i >= 0 && i < dummy.length && j >= 0 && j < dummy[0].length) {
                          dummy[i][j] = Math.max(dummy[i][j], 100 / (x + 1));
                          // dummy[i][j] += 100 / ((x + 1) * (x + 1));
                        }
                      }
                    }
                    x++;
              
                    let can = dummy.flat().filter((value) => value === 0);
                    if (can.length === 0) {
                      emptiness = false;
                    }
                  }
                }
              
                return dummy;
              }
              

            
              
function square_to_polygon(list, polygon) {
                const pol_dum = [];
                for (const j of list) {
                  const temp = [];
                  for (const i of j) {
                    temp.push(`${i[0]} ${i[1]}`);
                  }
                  temp.push(temp[0]);
                  const tempStr = temp.join(",");
                  const polygonStr = `${polygon}((${tempStr}))`;
                  pol_dum.push(polygonStr);
                }
                return pol_dum;
              }

function agg_heatmap(squarecenter, P) {
                const a = generation_square(squarecenter);
                const can_ = Array.from({ length: Math.sqrt(a.length) }, () =>
                  Array(Math.sqrt(a.length)).fill(0)
                );
                for (const p of P) {
                  const t_ = generate_heatmap_by_point(p, a);
                  if (t_.length > 0) {
                    for (let i = 0; i < Math.sqrt(a.length); i++) {
                      for (let j = 0; j < Math.sqrt(a.length); j++) {
                        can_[i][j] += t_[i][j];
                      }
                    }
                  }
                }
                return [can_, a];
              }
              
function CPVP_value(critical_point, can, square) {
                const a = can;
                const b = square;
                const c = critical_point;
                const [f, p] = n_to_coords(fit_point_to_square(c, b));
                const m = Math.max(...a.flat());
                let val = 0;
                if (m !== 0) {
                  val = a[f][p] / m;
                }
                return val;
              }
              
function CPVP_int_1(criticalpoint, P) {
                const [a, b] = agg_heatmap(criticalpoint, P);
                const c = CPVP_value(criticalpoint, a, b);
                return c;
              }