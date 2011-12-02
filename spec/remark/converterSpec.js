describe('converter', function () {

  describe('convertSlideClasses', function () {
    var convert = function(text) {
      var content = {innerHTML: text};
      module.converter.convertSlideClasses(content);
      return content;
    };

    it('should leave regular text as it', function () {
      expect(convert('some text').innerHTML).toBe('some text');
    });

    it('should ignore class not on beginning of line', function () {
      expect(convert(' .class').innerHTML).toBe(' .class');
    });

    it('should unescape escaped test', function () {
      expect(convert('\\.class').innerHTML).toBe('.class');
    });

    it('should ignore content class with square brackets', function () {
      expect(convert('.class[text]').innerHTML).toBe('.class[text]');
    });

    it('should extract single class', function () {
      expect(convert('.class').innerHTML).toBe('');
    });

    it('should apply single class', function () {
      expect(convert('.class').className).toBe('content class');
    });

    it('should extract multiple classes', function () {
      expect(convert('.a.b.c').innerHTML).toBe('');
    });

    it('should apply multiple classes', function () {
      expect(convert('.a.b.c').className).toBe('content a b c');
    });
  });

  describe('convertContentClasses', function () {
    var convert = function(text) {
      var content = {innerHTML: text};
      module.converter.convertContentClasses(content);
      return content.innerHTML;
    };

    it('should leave regular text as is', function () {
      expect(convert('some text')).toBe('some text');
    });

    it('should ignore class without square brackets', function () {
      expect(convert('.class')).toBe('.class');
    });

    it('should ignore escaped class without square brackets', function () {
      expect(convert('\\.class')).toBe('\\.class');
    });

    it('should unescape escaped class', function () {
      expect(convert('\\.class[text]')).toBe('.class[text]');
    });

    it('should convert single class', function () {
      expect(convert('.class[text]'))
        .toBe('<span class="class">text</span>')
    });

    it('should convert several classes', function () {
      expect(convert('.class[text] and .class2[text]'))
        .toBe('<span class="class">text</span> and <span class="class2">text</span>')
    });

    it('should convert multiple classes', function () {
      expect(convert('.a.b.c[text]'))
        .toBe('<span class="a b c">text</span>');
    });

    it('should convert recursive classes', function () {
      expect(convert('.a[text.b[text]]'))
        .toBe('<span class="a">text<span class="b">text</span></span>');
    });

    it('should convert class containing fancy markdown', function () {
      expect(convert('.right[![title](image.png)]'))
        .toBe('<span class="right">![title](image.png)</span>')
    });
  });

  describe('convertMarkdown', function () {
    var convert = function (text) {
      var content = {innerHTML: text};

      Showdown = {
        converter: function () {
          return {
            makeHtml: function (text) {
              return text; 
            }
          };
        }
      };

      module.converter.convertMarkdown(content)

      return content.innerHTML;
    };

    it('should unescape HTML', function () {
      expect(convert('&lt;b class="test"&gt;a&lt;/b&gt;'))
        .toBe('<b class="test">a</b>');
    });

    it('should unescape once HTML escaped twice in code tags', function () {
      expect(
        convert('<p><code>&amp;lt;p&amp;gt;a&amp;lt;/p&amp;gt;</code></p>'))
        .toBe('<p><code>&lt;p&gt;a&lt;/p&gt;</code></p>');
    });
  });

  describe('convertCodeClasses', function () {
    var convert = function(code, parentTagName) {
      var i
        , content = document.createElement(parentTagName || 'div')
        , node = document.createElement('code')
        ;

      node.innerHTML = code;
      content.appendChild(node);

      module.converter.convertCodeClasses(content);

      return node;
    };

    it('should disable highlighting for inline code by default', function () {
      expect(convert('var a = 5;').className).toBe('no-highlight');
    });

    it('should not disable highlighting for code by default', function () {
      expect(convert('var a = 5;', 'pre').className).toBe('');
    });

    it('should extract inline code class', function () {
      expect(convert('.ruby a = 5').innerHTML).toBe('a = 5');
    });

    it('should apply inline code class', function () {
      expect(convert('.ruby a = 5').className).toBe('ruby');
    });

    it('should extract code class', function () {
      expect(convert('.ruby\na = 5').innerHTML).toBe('a = 5');
    });

    it('should apply code class', function () {
      expect(convert('.ruby\na = 5').className).toBe('ruby');
    });

    it('should unescape escaped inline code class', function () {
      expect(convert('\\.ruby a = 5').innerHTML).toBe('.ruby a = 5');
    });

    it('should unescape escaped code class', function () {
      expect(convert('\\.ruby\na = 5', 'pre').innerHTML).toBe('.ruby\na = 5');
    });
  });

});
