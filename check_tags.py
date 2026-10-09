import re

with open('src/app/app/page.tsx', 'r') as f:
    text = f.read()

# Remove comments
text = re.sub(r'//.*', '', text)
text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)

# Find all tags
tags = re.findall(r'<\/?([a-zA-Z0-9\.]+)[^>]*>', text)

stack = []
for idx, match in enumerate(re.finditer(r'<\/?([a-zA-Z0-9\.]+)[^>]*>', text)):
    tag_str = match.group(0)
    tag_name = match.group(1)
    
    # Skip self-closing
    if tag_str.endswith('/>'):
        continue
        
    # Open tag
    if not tag_str.startswith('</'):
        stack.append((tag_name, match.start()))
    # Close tag
    else:
        if not stack:
            print(f"Error: closing tag {tag_name} without open tag at {match.start()}")
            break
        last_open = stack.pop()
        if last_open[0] != tag_name:
            print(f"Error: Mismatched tag at {match.start()}: Expected </{last_open[0]}> but found </{tag_name}> (opened at {last_open[1]})")
            break

if stack:
    print(f"Unclosed tags remaining: {stack}")
else:
    print("All tags matched perfectly.")

