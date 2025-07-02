declare module 'astro-og-canvas' {
  export type RGBColor = [r: number, g: number, b: number];
  export type XYWH = [x: number, y: number, w: number, h: number];
  export type LogicalSide = 'block-start' | 'inline-end' | 'block-end' | 'inline-start';
  export type IllogicalSide = 'top' | 'right' | 'bottom' | 'left';
  export type LogicalPosition = 'start' | 'center' | 'end';

  export interface FontConfig {
    color?: RGBColor;
    size?: number;
    weight?: string;
    lineHeight?: number;
    families?: string[];
  }

  export interface OGImageOptions {
    cacheDir?: string | false;
    title: string;
    description?: string;
    dir?: 'rtl' | 'ltr';
    logo?: {
      path: string;
      size?: [width?: number, height?: number];
    };
    bgGradient?: RGBColor[];
    bgImage?: {
      path: string;
      fit?: 'cover' | 'contain' | 'none' | 'fill';
      position?: LogicalPosition | [LogicalPosition, LogicalPosition];
    };
    border?: {
      color?: RGBColor;
      width?: number;
      side?: LogicalSide;
    };
    padding?: number;
    font?: {
      title?: FontConfig;
      description?: FontConfig;
    };
    fonts?: string[];
    format?: string;
    quality?: number;
  }

  export function OGImageRoute(opts: {
    pages: { [path: string]: any };
    param: string;
    getSlug?: (path: string, page: any) => string;
    getImageOptions: (path: string, page: any) => OGImageOptions | Promise<OGImageOptions>;
  }): {
    getStaticPaths: any;
    GET: any;
  };

  export function generateOpenGraphImage(options: OGImageOptions): Promise<Buffer>;
}
