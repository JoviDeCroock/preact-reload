use swc_core::ecma::{
  ast::{Program, TsModuleDecl},
  transforms::testing::test,
  visit::{as_folder, FoldWith, VisitMut},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct Prefresh;

// TODO: main logic
impl VisitMut for Prefresh {
  fn visit_mut_ts_module_decl(&mut self, _: &mut TsModuleDecl) {}
}

/// We let user do /* @refresh reset */ to reset state in the whole file.
impl<C> Visit for Prefresh<C>
where
    C: Comments,
{
    fn visit_span(&mut self, n: &Span) {
        if self.should_reset {
            return;
        }

        let mut should_refresh = self.should_reset;
        if let Some(comments) = &self.comments {
            if !n.hi.is_dummy() {
                comments.with_leading(n.hi - BytePos(1), |comments| {
                    if comments.iter().any(|c| c.text.contains("@refresh reset")) {
                        should_refresh = true
                    }
                });
            }

            comments.with_leading(n.lo, |comments| {
                if comments.iter().any(|c| c.text.contains("@refresh reset")) {
                    should_refresh = true
                }
            });

            comments.with_trailing(n.lo, |comments| {
                if comments.iter().any(|c| c.text.contains("@refresh reset")) {
                    should_refresh = true
                }
            });
        }

        self.should_reset = should_refresh;
    }
}
