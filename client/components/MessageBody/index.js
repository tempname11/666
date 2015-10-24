import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import md from '../../../common/md';
import emoji from '../../../common/emoji';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { text } = this.props;
    const htmlString = md(emoji(text));
    return (
      <article className="md"
        dangerouslySetInnerHTML={{ __html: htmlString }} />
    );
  },
});

