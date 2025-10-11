# coding=utf-8
"""
    @project: LLM-Know
    @Author：PanShangGuo
    @file： lt_compare.py
    @date：2024/6/11 9:52
    @desc: 大于比较器
"""
from typing import List

from application.flow.compare import Compare


class GECompare(Compare):

    def support(self, node_id, fields: List[str], source_value, compare, target_value):
        if compare == 'ge':
            return True

    def compare(self, source_value, compare, target_value):
        try:
            return float(source_value) >= float(target_value)
        except Exception as e:
            try:
                return str(source_value) >= str(target_value)
            except Exception as _:
                pass
            return False
