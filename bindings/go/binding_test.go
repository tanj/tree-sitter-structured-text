package tree_sitter_structured_text_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-structured_text"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_structured_text.Language())
	if language == nil {
		t.Errorf("Error loading StructuredText grammar")
	}
}
