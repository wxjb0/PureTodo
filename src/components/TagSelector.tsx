import React, { useState, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import TagChip from './TagChip';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
];

const TagSelector = React.memo(function TagSelector({
  selectedTagIds,
  onChange,
}: TagSelectorProps) {
  const tagList = useTaskStore((state) => state.tagList);
  const addTag = useTaskStore((state) => state.addTag);
  const deleteTag = useTaskStore((state) => state.deleteTag);

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[5]);

  const handleToggleTag = useCallback(
    (tagId: string) => {
      if (selectedTagIds.includes(tagId)) {
        onChange(selectedTagIds.filter((id) => id !== tagId));
      } else {
        onChange([...selectedTagIds, tagId]);
      }
    },
    [selectedTagIds, onChange]
  );

  const handleAddTag = useCallback(() => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    addTag(trimmed, newTagColor);
    setNewTagName('');
  }, [newTagName, newTagColor, addTag]);

  const handleDeleteTag = useCallback(
    (tagId: string) => {
      deleteTag(tagId);
      if (selectedTagIds.includes(tagId)) {
        onChange(selectedTagIds.filter((id) => id !== tagId));
      }
    },
    [deleteTag, selectedTagIds, onChange]
  );

  return (
    <div className="space-y-3">
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagList.map((tag) => (
            <TagChip
              key={tag.id}
              name={tag.name}
              color={tag.color}
              selected={selectedTagIds.includes(tag.id)}
              removable
              onClick={() => handleToggleTag(tag.id)}
              onRemove={() => handleDeleteTag(tag.id)}
              size="md"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="新标签名称"
          className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTag();
          }}
        />
        <div className="flex gap-1">
          {TAG_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setNewTagColor(color)}
              className={`w-5 h-5 rounded-full transition-all duration-200 ${newTagColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-300 shadow-sm' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          onClick={handleAddTag}
          disabled={!newTagName.trim()}
          className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          添加
        </button>
      </div>
    </div>
  );
});

export default TagSelector;
