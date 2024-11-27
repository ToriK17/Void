require 'pycall/import'
include PyCall::Import

pyimport 'transformers', as: :transformers

TRANSFORMERS_PIPELINE = transformers.pipeline(
  'zero-shot-classification',
  model: 'facebook/bart-large-mnli',
  device: -1 # -1 for CPU, 0 for GPU testing to see which is faster with local hardware
)
