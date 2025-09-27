'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import { Extension, Editor, ChainedCommands } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';
// Import Table Extensions
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';

// Icons
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { LuHeading2, LuHeading3, LuHeading4 } from "react-icons/lu";
import { FaLink, FaImage } from "react-icons/fa";
import { RiParagraph } from "react-icons/ri";
import { BiAlignLeft, BiAlignRight, BiAlignMiddle } from "react-icons/bi";
import { TbTable } from "react-icons/tb";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
    };
  }
}
// Define size option interface
interface SizeOption {
  class: string;
  style: string;
}

interface FontSizeOptions {
  types: string[];
  defaultSize: string;
  sizes: Record<string, SizeOption>;
}

// Custom FontSize Extension with predefined classes and inline styles for editing
const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',
  
  addOptions() {
    return {
      types: ['textStyle'],
      defaultSize: 'default',
      sizes: {
        'small': { class: 'text-sm', style: '12px' },
        'default': { class: 'text-base', style: '16px' },
        'large': { class: 'text-lg', style: '18px' },
        'xlarge': { class: 'text-xl', style: '20px' },
        'xxlarge': { class: 'text-2xl', style: '24px' },
      },
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: this.options.defaultSize,
            parseHTML: element => {
              // Try to extract from style first
              const fontSize = element.style.fontSize;
              if (fontSize) {
                // Find the key by style value
                const entries = Object.entries(this.options.sizes);
                const entry = entries.find(([_, value]) => value.style === fontSize);
                if (entry) return entry[0];
              }
              
              // Then try from class names
              const classList = [...element.classList];
              const entries = Object.entries(this.options.sizes);
              
              for (const [key, value] of entries) {
                if (classList.includes(value.class)) {
                  return key;
                }
              }
              
              return this.options.defaultSize;
            },
            renderHTML: attributes => {
              const sizeKey = attributes.fontSize || this.options.defaultSize;
              const sizeValue = this.options.sizes[sizeKey] || this.options.sizes[this.options.defaultSize];
              
              // Return both class and inline style to ensure consistent display in both viewing and editing
              return { 
                class: sizeValue.class,
                style: `font-size: ${sizeValue.style}` 
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: { chain: () => ChainedCommands }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
    };
  },
});

// Font sizes with class names and style values
interface FontSizeOption {
  label: string;
  value: string;
  className: string;
  styleValue: string;
}

const fontSizes: FontSizeOption[] = [
  { label: 'Small', value: 'small', className: 'text-sm', styleValue: '12px' },
  { label: 'Default', value: 'default', className: 'text-base', styleValue: '16px' },
  { label: 'Large', value: 'large', className: 'text-lg', styleValue: '18px' },
  { label: 'XL', value: 'xlarge', className: 'text-xl', styleValue: '20px' },
  { label: '2XL', value: 'xxlarge', className: 'text-2xl', styleValue: '24px' },
];

// Custom Resizable Image Extension
const CustomImage = Image.extend({
  addAttributes() {
    const parentAttributes = this.parent?.() || {};
    
    return {
      ...parentAttributes,
      width: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('width') || 'auto',
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.style.textAlign || 'center',
        renderHTML: (attributes) => ({
          style: `display: block; margin: 0 auto; text-align: ${attributes.align};`,
        }),
      },
    };
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  // Add CSS for editor content to properly display font sizes during editing
  useEffect(() => {
    if (mounted) {
      // Add a style tag to document head for editor content styling
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        .ProseMirror .text-sm { font-size: 12px !important; }
        .ProseMirror .text-base { font-size: 16px !important; }
        .ProseMirror .text-lg { font-size: 18px !important; }
        .ProseMirror .text-xl { font-size: 20px !important; }
        .ProseMirror .text-2xl { font-size: 24px !important; }
      `;
      document.head.appendChild(styleTag);
      
      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph',
          },
        },
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
        defaultSize: 'default',
        sizes: {
          'small': { class: 'text-sm', style: '12px' },
          'default': { class: 'text-base', style: '16px' },
          'large': { class: 'text-lg', style: '18px' },
          'xlarge': { class: 'text-xl', style: '20px' },
          'xxlarge': { class: 'text-2xl', style: '24px' },
        },
      }),
      Link,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ['heading', 'paragraph', 'table'] }),
      CustomImage,
      // Add Table Extensions
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-t border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-bold border-b border-gray-300 p-2 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted) return null;
  if (!editor) return null;

  // Set font size using the command
  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  // Insert image with adjustable size & alignment
  const insertImage = (): void => {
    const url: string | null = prompt('Enter the image URL');
    if (url) {
      const width: string = prompt('Enter image width (e.g., 100px, 50%)', 'auto') || 'auto';
      const align: 'left' | 'center' | 'right' =
        (prompt('Enter image alignment (left, center, right)', 'center') as 'left' | 'center' | 'right') || 'center';
  
      // Insert image first, then update its attributes
      editor?.chain().focus().setImage({ src: url }).run();
      
      // Find the last inserted image and update attributes
      setTimeout(() => {
        const { state } = editor;
        const pos = state.selection.from - 1; // Get the last inserted image position
        const node = state.doc.nodeAt(pos);
  
        if (node?.type.name === 'image') {
          editor.chain().focus().updateAttributes('image', { width, align }).run();
        }
      }, 10);
    }
  };

  // Insert table with specified rows and columns
  const insertTable = (): void => {
    const rows = parseInt(prompt('Enter number of rows', '3') || '3', 10);
    const cols = parseInt(prompt('Enter number of columns', '3') || '3', 10);
    
    if (rows > 0 && cols > 0) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    }
  };

  // Table controls
  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteTable = () => editor.chain().focus().deleteTable().run();
  const mergeCells = () => editor.chain().focus().mergeCells().run();
  const splitCell = () => editor.chain().focus().splitCell().run();
  const toggleHeaderColumn = () => editor.chain().focus().toggleHeaderColumn().run();
  const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run();
  const toggleHeaderCell = () => editor.chain().focus().toggleHeaderCell().run();

  return (
    <div className="p-4 border rounded-md">
      <style jsx global>{`
        .tiptap-editor .ProseMirror [style*="font-size: 12px"] { font-size: 12px !important; }
        .tiptap-editor .ProseMirror [style*="font-size: 16px"] { font-size: 16px !important; }
        .tiptap-editor .ProseMirror [style*="font-size: 18px"] { font-size: 18px !important; }
        .tiptap-editor .ProseMirror [style*="font-size: 20px"] { font-size: 20px !important; }
        .tiptap-editor .ProseMirror [style*="font-size: 24px"] { font-size: 24px !important; }
      `}</style>
      <div className="space-x-2 mb-2 flex flex-wrap gap-y-2">
        {/* Text formatting */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()} 
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <MdFormatBold size={22}/>
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <MdFormatItalic size={22}/>
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <MdFormatUnderlined size={22}/>
        </button>

        {/* Font size dropdown */}
        <div className="flex space-x-1">
          {fontSizes.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFontSize(value)}
              className={`p-1 rounded ${
                editor.getAttributes('textStyle').fontSize === value ? 'bg-gray-300' : ''
              }`}
              title={`Font Size: ${label}`}
             
            >
              {label}
            </button>
          ))}
        </div>

        {/* Headings */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <LuHeading2 size={22}/>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="Heading 3"
        >
          <LuHeading3 size={22}/>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-1 rounded ${editor.isActive('heading', { level: 4 }) ? 'bg-gray-200' : ''}`}
          title="Heading 4"
        >
          <LuHeading4 size={22}/>
        </button>

        <button 
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
          title="Paragraph"
        >
          <RiParagraph size={22}/>
        </button>
       
  

        {/* Text alignment */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Align Left"
        >
          <BiAlignLeft size={22}/>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Align Center"
        >
          <BiAlignMiddle size={22}/>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Align Right"
        >
          <BiAlignRight size={22}/>
        </button>

        {/* Lists */}
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <MdFormatListBulleted size={22}/>
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <MdFormatListNumbered size={22}/>
        </button> 
     
       
        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter the URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Insert Link"
        >
          <FaLink size={18}/>
        </button>


      
      </div>

   
      <EditorContent 
        editor={editor} 
        className="border p-2 min-h-[200px] tiptap-editor" 
      />
    </div>
  );
};

export default TiptapEditor;