import { FileIcon } from '@/components/1_atoms/documents/file-icon';
import { render } from '@testing-library/react';

describe('FileIcon', () => {
  it('renders PDF icon with correct styling', () => {
    const { container } = render(<FileIcon fileType="pdf" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-4', 'w-4', 'text-red-500');
  });

  it('renders DOC icon with correct styling', () => {
    const { container } = render(<FileIcon fileType="doc" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-4', 'w-4', 'text-blue-500');
  });

  it('renders XLSX icon with correct styling', () => {
    const { container } = render(<FileIcon fileType="xlsx" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-4', 'w-4', 'text-green-500');
  });

  it('renders image icon with correct styling', () => {
    const { container } = render(<FileIcon fileType="image" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-4', 'w-4', 'text-purple-500');
  });

  it('renders default file icon for unknown type', () => {
    const { container } = render(<FileIcon fileType="txt" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-4', 'w-4', 'text-gray-500');
  });

  it('applies custom className', () => {
    const { container } = render(<FileIcon fileType="pdf" className="custom-size" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-size', 'text-red-500');
  });

  it('overrides default className when custom className is provided', () => {
    const { container } = render(<FileIcon fileType="pdf" className="h-8 w-8" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-8', 'w-8', 'text-red-500');
    expect(svg).not.toHaveClass('h-4', 'w-4');
  });

  it('renders different icons for different file types', () => {
    const { container: pdfContainer } = render(<FileIcon fileType="pdf" />);
    const { container: docContainer } = render(<FileIcon fileType="doc" />);
    const { container: xlsxContainer } = render(<FileIcon fileType="xlsx" />);
    const { container: imageContainer } = render(<FileIcon fileType="image" />);

    // All should have SVG elements
    expect(pdfContainer.querySelector('svg')).toBeInTheDocument();
    expect(docContainer.querySelector('svg')).toBeInTheDocument();
    expect(xlsxContainer.querySelector('svg')).toBeInTheDocument();
    expect(imageContainer.querySelector('svg')).toBeInTheDocument();

    // But with different colors
    expect(pdfContainer.querySelector('svg')).toHaveClass('text-red-500');
    expect(docContainer.querySelector('svg')).toHaveClass('text-blue-500');
    expect(xlsxContainer.querySelector('svg')).toHaveClass('text-green-500');
    expect(imageContainer.querySelector('svg')).toHaveClass('text-purple-500');
  });
});
