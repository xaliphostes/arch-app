import { DataFrame } from '@youwol/dataframe'
import { forward } from '@youwol/geophysics'

/**
 * @example
 * The following example will generate a new Serie in
 * the DataFrame named "S" and based on four existing models labelled
 * "S1" to "S4" (hense the startIndex = 1), since the size of alpha is 4.
 * ```ts
 * compute({
 *      prefix: 'S',
 *      alpha: [1, 2, 3, 4], // i.e., [xx, xy, yy, zz] which represents the far field stress
 *      dataframe: df,
 *      startIndex: 1 // by default, so not mandatory
 * })
 * ```
 */
export function compute({ prefix, alpha, df, startIndex=1 }: { prefix: string, alpha: number[], df: DataFrame, startIndex?: number }) {
    df.series[prefix] = forward.attribute({
        simulations: df,
        name: prefix,
        alpha,
        startIndex
    })
}
