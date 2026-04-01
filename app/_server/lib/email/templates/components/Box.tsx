import { type CSSProperties, Children, type DetailedHTMLProps, type HTMLAttributes } from 'react';

interface BoxProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  classNames?: string[];
  styles?: CSSProperties[];
  gap?: number;
}

export const Box = ({ classNames, styles, children, style, gap, ...props }: BoxProps) => {
  return (
    <div style={{ width: '100%', maxWidth: '600px', ...style }} {...props}>
      <table style={{ width: '100%' }}>
        {Children.toArray(children).map((child, idx, arr) => (
          <tr key={idx} style={{ width: '100%' }}>
            <td
              style={{
                width: '100%',
              }}>
              <div
                style={{
                  width: '100%',
                  ...(child && gap && idx < arr.length - 1 && { marginBottom: `${gap}px` }),
                  ...(styles?.[idx] && styles[idx]),
                }}
                className={classNames?.[idx] || ''}>
                {child}
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
