const fs = require('fs');

let view = fs.readFileSync('src/components/ThumbnailStudioView.tsx', 'utf8');

const keywordInputComponent = `
const KeywordInput = ({ post, onUpdatePost }: any) => {
  const [inputValue, setInputValue] = React.useState('');
  const pills = post.keyPills ? post.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean) : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newPills = [...pills, inputValue.trim()];
      onUpdatePost({ keyPills: newPills.join(' • '), showKeyPills: true });
      setInputValue('');
    }
  };

  const removePill = (idx: number) => {
    const newPills = [...pills];
    newPills.splice(idx, 1);
    onUpdatePost({ keyPills: newPills.join(' • '), showKeyPills: newPills.length > 0 });
  };

  return (
    <div className="space-y-1.5 pt-4 border-t border-gray-400">
      <label className="text-xs font-black text-black uppercase tracking-widest">
        Keywords (Press Enter to add):
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {pills.map((p: string, i: number) => (
          <div key={i} className="flex items-center gap-1 bg-[#000080] text-white px-2 py-1 text-xs font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span>{p}</span>
            <button onClick={() => removePill(i)} className="text-white hover:text-[#ff00ff] ml-1">×</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
        placeholder="Type keyword and press Enter..."
      />
    </div>
  );
};
`;

// Insert the KeywordInput component before ThumbnailStudioView
view = view.replace('export const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({', keywordInputComponent + '\nexport const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({');

// Replace the old Key Pills block
const oldPillRegex = /\{\/\* Key Pills Bar \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>/s;
const newPillStr = `
              {/* Keywords Tag Input */}
              <KeywordInput post={post} onUpdatePost={onUpdatePost} />
            </div>
          </div>`;

view = view.replace(oldPillRegex, newPillStr);

fs.writeFileSync('src/components/ThumbnailStudioView.tsx', view);
