<?php

namespace App\Model\Behavior;


use ArrayObject;
use Cake\ORM\Table;
use Cake\Event\Event;
use Cake\ORM\Behavior;
use Cake\Datasource\EntityInterface;
use Cake\Database\Expression\QueryExpression;


/**
 * Position Behavior.
 *
 * データ並び順を設定
 *
 */
class PositionBehavior extends Behavior
{
    public $settings;
    public $objectModel;
    /**
     * Defaults
     *
     * @var array
     */
    protected $_defaults = array(
        'field' => 'position',
        'group' => [],
        'groupMove' => false,
        'order' => 'ASC',
        'recursive' => -1,
    );

    protected $_old_position = 0;
    protected $_old_group_conditions = [];


    public function initialize(array $config): void
    {
        $settings = $config + $this->_defaults;
        $this->settings[$this->_table->getAlias()] = $settings;
    }

    /**
     * The display position of data is changed.
     * 並び順を変更する
     *
     * @since 13/02/07 11:37
     * @param  Integer    $id  primary key
     * @param  String    $dir Moving direction
     *                   [top, bottom, up, down]
     * @return bool
     */
    public function movePosition(Table $model, $id, $dir, $options = [])
    {
        $modelName = $model->getAlias();

        extract($this->settings[$modelName]);
        if (!$this->enablePosition($model)) return false;

        $conditions = $this->groupConditions($model, $id);

        $primary_key = $model->getPrimaryKey();

        if (get_class($model) !== \Cake\ORM\Table::class) {
            $data = $model->find()
                ->select([$primary_key, $field])
                ->where([$primary_key => $id])
                ->first();

            $position = $data->{$field};
            if (empty($position)) return false;

            if ($dir === 'top') {
                $expression = new QueryExpression($field . ' = ' . $field . ' + 1');

                $model->updateAll([$expression], array_merge([$field . ' < ' => $position], $conditions));
                $model->updateAll([$field => 1], [$primary_key => $id]);
            } else if ($dir === 'bottom') {
                $count = $model->find()->count();
                $expression = new QueryExpression($field . ' = ' . $field . ' - 1');

                $model->updateAll([$expression], array_merge([$field . ' >' => $position], $conditions));
                $model->updateAll([$field => $count], [$primary_key => $id]);
            } else if ($dir === 'up') {
                if (1 < $position) {
                    $expression = new QueryExpression($field . ' = ' . $field . ' + 1');

                    $model->updateAll([$expression], array_merge([$field => $position - 1], $conditions));
                    $model->updateAll([$field => $position - 1], [$primary_key => $id]);
                }
            } else if ($dir === 'down') {
                $count = $model->find()->count();
                if ($position < $count) {
                    $expression = new QueryExpression($field . ' = ' . $field . ' - 1');
                    $model->updateAll([$expression], array_merge([$field => $position + 1], $conditions));
                    $model->updateAll([$field => $position + 1], [$primary_key => $id]);
                }
            }
        }
    }

    public function beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $model = $event->getSubject();
        $modelName = $model->getAlias();

        $id = isset($model->id) ? $model->id : 0;
        //
        extract($this->settings[$modelName]);

        if ($this->enablePosition($model) && !empty($group) && $this->enableGroupMove($model)) {
            // 保存前のデータ取得
            $primary_key = $model->getPrimaryKey();
            $current_check = $model->exists([$primary_key => $id]);

            if ($current_check) {
                $data = $model->get($id);
                $old_check = $model->exists([$primary_key => $id]);

                if ($old_check) {
                    $old = $model->get($id);


                    // グループ変更チェック
                    $_isGroupUpdated = false;
                    foreach ($group as $_col) {
                        if ($data->{$_col} && $data->{$_col} != $old->{$_col}) {
                            $_isGroupUpdated = true;
                            break;
                        }
                    }
                    if ($_isGroupUpdated) {
                        foreach ($group as $_col) {
                            $this->_old_group_conditions[$_col] = $old->{$_col};
                            $this->_old_position = $old->{$field};
                        }
                    }
                }
            }
        }

        return true;
    }
    public function afterSave(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $model = $event->getSubject();
        $primary_key = $model->getPrimaryKey();

        extract($this->settings[$model->getAlias()]);

        $created = $entity->isNew();
        $id = $entity->id;

        if ($created) {
            if ($this->enablePosition($model)) {
                $cond = $this->groupConditions($model, $id);
                $save = [];

                if (strtoupper($order) === 'DESC') {
                    $save = [$field => $model->find()->count()];
                    $cond = [$primary_key => $id];
                } else $save = [new QueryExpression($field . ' = ' . $field . ' + 1')];

                return $model->updateAll($save, $cond);
            }
        } else {
            if ($this->enablePosition($model) && !empty($group) && !empty($this->_old_group_conditions)) {

                // 保存前のグループの並び順
                $this->_old_group_conditions[$field . ' >'] = $this->_old_position;
                $expression = new QueryExpression($field . ' = ' . $field . ' - 1');

                $model->updateAll([$expression], $this->_old_group_conditions);
                // 保存後のグループの並び順
                return $this->afterSave($event, $entity, $options);
            }
        }
    }

    public function beforeDelete(Event $event, EntityInterface $entity, $cascade = true)
    {
        $modelName = $event->getSubject()->getAlias();
        extract($this->settings[$modelName]);
        if ($this->enablePosition($event->getSubject()))
            $this->movePosition($event->getSubject(), $entity->id, 'bottom');

        return true;
    }
    /**
     * グループ設定ありの並び順変更の有無
     * @param  Model  $Model [description]
     * @return [type]        [description]
     */
    public function enableGroupMove($model)
    {
        extract($this->settings[$model->getAlias()]);
        return $groupMove;
    }
    /**
     * 並び替えの有無
     * 
     * */
    public function enablePosition($model)
    {
        $modelName = $model->getAlias();
        extract($this->settings[$modelName]);
        return ($field && $model->hasField($field));
    }

    /**
     * 並び順グループ設定
     *
     * */
    public function groupConditions($model, $id)
    {
        $modelName = $model->getAlias();
        extract($this->settings[$modelName]);
        $cond = [];
        if ($group && $id) {
            $group = (array) $group;
            if ($model->exists([$model->getPrimaryKey() => $id])) {
                $data = $model->get($id);

                foreach ($group as $column) {
                    if (strpos($column, '.') !== false) {
                        $_model = explode('.', $column);
                        if (count($_model) == 2) {
                            $column = $_model[1];
                        }
                    }

                    if (isset($data->{$column})) {
                        $cond[$modelName . '.' . $column] = $data->{$column};
                    }
                }
            }
        }
        return $cond;
    }

    /**
     * 並び替えを再設定
     * */
    public function resetPosition(Table $model, array $conditions = array())
    {
        extract($this->settings[$model->modelName]);
        if ($this->enablePosition($model)) {
            $model_name = $model->modelName;
            $position_field = $model->escapeField($field);
            $primary_key = $model->escapeField($model->primaryKey);
            $conditions = $this->groupConditions($model, $id);

            $position = 1;
            $data = $model->find('all', array(
                'order' => $position_field . ' ' . $order,
                'conditions' => $conditions,
                'recursive' => $recursive
            ));
            foreach ($data as $key => $value) {
                if (!empty($value[$this->alias][$model->primaryKey])) {
                    $conditions[$primary_key] = $value[$model_name][$model->primaryKey];
                    $model->updateAll(array($position_field => $position), $conditions);
                    ++$position;
                }
            }
        }
    }
}
